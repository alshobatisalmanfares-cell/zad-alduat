import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminMutate } from "@/lib/admin.functions";


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
  const [khutab, setKhutab] = useLS<Khutbah[]>("zad.khutab.cache", []);
  const [khutabLoading, setKhutabLoading] = useState<boolean>(khutab.length === 0);
  const [azkar, setAzkar] = useLS<Dhikr[]>("zad.azkar.cloud", []);
  const [categories, setCategories] = useLS<Category[]>("zad.cats", seedCategories);
  const [hadithOfDay, setHadithLocal] = useState<string>(seedHadith);

  const [favorites, setFavorites] = useLS<Favorite[]>("zad.favs", []);
  const [isAdmin, setIsAdmin] = useLS<boolean>("zad.admin", false);
  // Persist admin password locally so mutations survive reloads (bugfix: "Not authenticated").
  const [adminPassword, setAdminPassword] = useLS<string | null>("zad.adminpw", null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", nightMode);
  }, [nightMode]);

  const [syncing, setSyncing] = useState(false);

  const fetchAll = async () => {
    const [{ data: kh }, { data: az }, { data: st }] = await Promise.all([
      supabase.from("khutab").select("*").order("created_at", { ascending: false }),
      supabase.from("azkar").select("*").order("sort_order", { ascending: true }),
      supabase.from("app_settings").select("value").eq("key", "hadith_of_day").maybeSingle(),
    ]);
    if (kh) setKhutab(kh as Khutbah[]);
    if (az) setAzkar((az as DhikrRow[]).map(mapDhikr));
    if (st?.value) setHadithLocal(st.value);
  };

  // Initial fetch + realtime sync from Supabase (cache-first; refreshes in background)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await fetchAll();
      } finally {
        if (alive) setKhutabLoading(false);
      }
    })().catch(() => { if (alive) setKhutabLoading(false); });


    const ch = supabase
      .channel("zad-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "khutab" }, async () => {
        const { data } = await supabase.from("khutab").select("*").order("created_at", { ascending: false });
        if (data) setKhutab(data as Khutbah[]);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "azkar" }, async () => {
        const { data } = await supabase.from("azkar").select("*").order("sort_order", { ascending: true });
        if (data) setAzkar((data as DhikrRow[]).map(mapDhikr));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, async () => {
        const { data } = await supabase.from("app_settings").select("value").eq("key", "hadith_of_day").maybeSingle();
        if (data?.value) setHadithLocal(data.value);
      })
      .subscribe();

    return () => {
      alive = false;
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
      if (row?.id) setKhutab((p) => (p.some((x) => x.id === row.id) ? p : [row, ...p]));
    },
    updateKhutbah: async (id, k) => {
      const row = (await adminMutate({ data: { password: requirePw(), action: "khutbah.update", id, data: k } })) as Khutbah;
      if (row?.id) setKhutab((p) => p.map((x) => (x.id === row.id ? row : x)));
    },
    deleteKhutbah: async (id) => {
      await adminMutate({ data: { password: requirePw(), action: "khutbah.delete", id } });
      setKhutab((p) => p.filter((x) => x.id !== id));
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
      if (row?.id) setAzkar((p) => sortAzkar([...p.filter((x) => x.id !== row.id), mapDhikr(row)]));
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
      if (row?.id) setAzkar((p) => sortAzkar(p.map((x) => (x.id === row.id ? mapDhikr(row) : x))));
    },
    deleteDhikr: async (id) => {
      await adminMutate({ data: { password: requirePw(), action: "dhikr.delete", id } });
      setAzkar((p) => p.filter((x) => x.id !== id));
    },
    categories,
    addCategory: (name) => setCategories((p) => [...p, { id: uid(), name }]),
    deleteCategory: (id) => setCategories((p) => p.filter((c) => c.id !== id)),
    hadithOfDay,
    syncing,
    syncData: async () => {
      if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
      setSyncing(true);
      try {
        await fetchAll();
        return true;
      } catch {
        return false;
      } finally {
        setSyncing(false);
      }
    },

    setHadithOfDay: async (t) => {
      await adminMutate({ data: { password: requirePw(), action: "hadith.set", data: { value: t } } });
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
