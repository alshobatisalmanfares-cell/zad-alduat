import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminMutate } from "@/lib/admin.functions";
import { idbGet, idbSet } from "@/lib/offline-db";



export type Khutbah = {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
};

export type Dhikr = {
  id: string;
  title: string;
  text: string;
  count: number;
  category: string; // e.g. "أذكار الصباح"
  sortOrder: number;
};

export type DhikrRow = {
  id: string;
  title: string;
  text: string;
  count: number;
  category: string;
  sort_order: number;
};

export const mapDhikr = (r: DhikrRow): Dhikr => ({
  id: r.id,
  title: r.title,
  text: r.text,
  count: r.count,
  category: r.category,
  sortOrder: r.sort_order ?? 0,
});

export type Category = { id: string; name: string };

export type Favorite = {
  id: string;
  type: "khutbah" | "dhikr" | "hadith";
  title: string;
  content: string;
};

type Store = {
  // settings
  fontScale: number;
  setFontScale: (n: number) => void;
  nightMode: boolean;
  toggleNight: () => void;
  // data
  khutab: Khutbah[];
  khutabLoading: boolean;
  addKhutbah: (k: Omit<Khutbah, "id">) => Promise<void>;
  updateKhutbah: (id: string, k: Partial<Khutbah>) => Promise<void>;
  deleteKhutbah: (id: string) => Promise<void>;
  azkar: Dhikr[];
  addDhikr: (d: Omit<Dhikr, "id">) => Promise<void>;
  updateDhikr: (id: string, d: Partial<Omit<Dhikr, "id">>) => Promise<void>;
  deleteDhikr: (id: string) => Promise<void>;
  categories: Category[];
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  hadithOfDay: string;
  syncing: boolean;
  syncData: () => Promise<boolean>;
  // offline
  hydrated: boolean;
  online: boolean;
  lastSyncAt: number | null;
  syncError: string | null;


  setHadithOfDay: (t: string) => Promise<void>;
  favorites: Favorite[];
  toggleFavorite: (f: Favorite) => void;
  isFavorite: (id: string) => boolean;
  // admin
  isAdmin: boolean;
  loginAdmin: (pw: string) => boolean;
  logoutAdmin: () => void;
  adminPassword: string | null;
};


const uid = () => Math.random().toString(36).slice(2, 10);

const sortAzkar = (list: Dhikr[]) => [...list].sort((a, b) => a.sortOrder - b.sortOrder);

const seedCategories: Category[] = [
  { id: "c1", name: "الإيمان" },
  { id: "c2", name: "الأخلاق" },
  { id: "c3", name: "العبادات" },
  { id: "c4", name: "الأسرة" },
];

const seedHadith =
  "عن أبي هريرة رضي الله عنه قال: قال رسول الله ﷺ: «مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ». رواه مسلم.";

const Ctx = createContext<Store | null>(null);

function useLS<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV];
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useLS("zad.fontScale", 1);
  const [nightMode, setNightMode] = useLS("zad.night", false);
  const [khutab, setKhutab] = useState<Khutbah[]>([]);
  const [khutabLoading, setKhutabLoading] = useState(true);
  const [azkar, setAzkar] = useState<Dhikr[]>([]);
  const [categories, setCategories] = useLS<Category[]>("zad.cats", seedCategories);
  const [hadithOfDay, setHadithLocal] = useState<string>(seedHadith);
  const [hydrated, setHydrated] = useState(false);
  const [online, setOnline] = useState(true);
  const [lastSyncAt, setLastSyncAt] = useLS<number | null>("zad.lastSync", null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [favorites, setFavorites] = useLS<Favorite[]>("zad.favs", []);
  const [isAdmin, setIsAdmin] = useLS<boolean>("zad.admin", false);
  // Persist admin password locally so mutations survive reloads (bugfix: "Not authenticated").
  const [adminPassword, setAdminPassword] = useLS<string | null>("zad.adminpw", null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", nightMode);
  }, [nightMode]);

  const [syncing, setSyncing] = useState(false);

  // ---- local offline database (IndexedDB) writers -------------------------
  const saveKhutab = (rows: Khutbah[]) => {
    setKhutab(rows);
    void idbSet("khutab", "all", rows);
  };
  const saveAzkar = (rows: Dhikr[]) => {
    setAzkar(rows);
    void idbSet("azkar", "all", rows);
  };
  const saveHadith = (text: string) => {
    setHadithLocal(text);
    void idbSet("settings", "hadith_of_day", text);
  };

  const fetchAll = async () => {
    const [khRes, azRes, stRes] = await Promise.all([
      supabase.from("khutab").select("*").order("created_at", { ascending: false }),
      supabase.from("azkar").select("*").order("sort_order", { ascending: true }),
      supabase.from("app_settings").select("value").eq("key", "hadith_of_day").maybeSingle(),
    ]);
    const err = khRes.error || azRes.error || stRes.error;
    if (err) throw err;
    if (khRes.data) saveKhutab(khRes.data as Khutbah[]);
    if (azRes.data) saveAzkar((azRes.data as DhikrRow[]).map(mapDhikr));
    if (stRes.data?.value) saveHadith(stRes.data.value);
    setLastSyncAt(Date.now());
    setSyncError(null);
  };

  const fetchRef = useRef(fetchAll);
  fetchRef.current = fetchAll;

  // 1) Hydrate instantly from the local offline database, 2) refresh from Supabase when online.
  useEffect(() => {
    let alive = true;

    (async () => {
      const [localKh, localAz, localHadith] = await Promise.all([
        idbGet<Khutbah[]>("khutab", "all"),
        idbGet<Dhikr[]>("azkar", "all"),
        idbGet<string>("settings", "hadith_of_day"),
      ]);
      if (!alive) return;
      if (localKh?.length) setKhutab(localKh);
      if (localAz?.length) setAzkar(localAz);
      if (localHadith) setHadithLocal(localHadith);
      setHydrated(true);
      setKhutabLoading(!localKh?.length);

      const isOnline = navigator.onLine !== false;
      setOnline(isOnline);
      if (isOnline) {
        try {
          await fetchRef.current();
        } catch {
          if (alive) setSyncError("تعذّر تحديث البيانات من الخادم — يتم العرض من النسخة المحفوظة.");
        }
      }
      if (alive) setKhutabLoading(false);
    })();

    // Auto-sync as soon as the connection comes back.
    const goOnline = () => {
      setOnline(true);
      fetchRef.current().catch(() => {});
    };
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    const ch = supabase
      .channel("zad-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "khutab" }, async () => {
        const { data } = await supabase.from("khutab").select("*").order("created_at", { ascending: false });
        if (data) saveKhutab(data as Khutbah[]);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "azkar" }, async () => {
        const { data } = await supabase.from("azkar").select("*").order("sort_order", { ascending: true });
        if (data) saveAzkar((data as DhikrRow[]).map(mapDhikr));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, async () => {
        const { data } = await supabase.from("app_settings").select("value").eq("key", "hadith_of_day").maybeSingle();
        if (data?.value) saveHadith(data.value);
      })
      .subscribe();

    return () => {
      alive = false;
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const requirePw = () => {
    if (!adminPassword) throw new Error("Not authenticated");
    return adminPassword;
  };

  const value: Store = {
    fontScale,
    setFontScale,
    nightMode,
    toggleNight: () => setNightMode((v) => !v),
    khutab,
    khutabLoading,
    addKhutbah: async (k) => {
      const row = (await adminMutate({ data: { password: requirePw(), action: "khutbah.create", data: k } })) as Khutbah;
      if (row?.id) saveKhutab(khutab.some((x) => x.id === row.id) ? khutab : [row, ...khutab]);
    },
    updateKhutbah: async (id, k) => {
      const row = (await adminMutate({ data: { password: requirePw(), action: "khutbah.update", id, data: k } })) as Khutbah;
      if (row?.id) saveKhutab(khutab.map((x) => (x.id === row.id ? row : x)));
    },
    deleteKhutbah: async (id) => {
      await adminMutate({ data: { password: requirePw(), action: "khutbah.delete", id } });
      saveKhutab(khutab.filter((x) => x.id !== id));
    },
    azkar,
    addDhikr: async (d) => {
      const row = (await adminMutate({
        data: {
          password: requirePw(),
          action: "dhikr.create",
          data: { title: d.title, text: d.text, category: d.category, count: d.count, sort_order: d.sortOrder ?? 0 },
        },
      })) as DhikrRow;
      if (row?.id) saveAzkar(sortAzkar([...azkar.filter((x) => x.id !== row.id), mapDhikr(row)]));
    },
    updateDhikr: async (id, d) => {
      const patch: Record<string, unknown> = {};
      if (d.title !== undefined) patch.title = d.title;
      if (d.text !== undefined) patch.text = d.text;
      if (d.category !== undefined) patch.category = d.category;
      if (d.count !== undefined) patch.count = d.count;
      if (d.sortOrder !== undefined) patch.sort_order = d.sortOrder;
      const row = (await adminMutate({
        data: { password: requirePw(), action: "dhikr.update", id, data: patch },
      })) as DhikrRow;
      if (row?.id) saveAzkar(sortAzkar(azkar.map((x) => (x.id === row.id ? mapDhikr(row) : x))));
    },
    deleteDhikr: async (id) => {
      await adminMutate({ data: { password: requirePw(), action: "dhikr.delete", id } });
      saveAzkar(azkar.filter((x) => x.id !== id));
    },

    categories,
    addCategory: (name) => setCategories((p) => [...p, { id: uid(), name }]),
    deleteCategory: (id) => setCategories((p) => p.filter((c) => c.id !== id)),
    hadithOfDay,
    syncing,
    hydrated,
    online,
    lastSyncAt,
    syncError,
    syncData: async () => {
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        setSyncError("لا يوجد اتصال بالإنترنت حالياً");
        return false;
      }
      setSyncing(true);
      try {
        await fetchAll();
        return true;
      } catch {
        setSyncError("تعذّر تحديث البيانات من الخادم — يتم العرض من النسخة المحفوظة.");
        return false;
      } finally {
        setSyncing(false);
      }
    },

    setHadithOfDay: async (t) => {
      await adminMutate({ data: { password: requirePw(), action: "hadith.set", data: { value: t } } });
      saveHadith(t);
    },

    favorites,
    toggleFavorite: (f) =>
      setFavorites((p) => (p.some((x) => x.id === f.id) ? p.filter((x) => x.id !== f.id) : [f, ...p])),
    isFavorite: (id) => favorites.some((x) => x.id === id),
    isAdmin,
    adminPassword,
    loginAdmin: (pw) => {
      if (pw === "77salmanfares77ss") {
        setIsAdmin(true);
        setAdminPassword(pw);
        return true;
      }
      return false;
    },
    logoutAdmin: () => {
      setIsAdmin(false);
      setAdminPassword(null);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}


export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within AppStoreProvider");
  return c;
}
