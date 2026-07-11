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
};

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
  addKhutbah: (k: Omit<Khutbah, "id">) => Promise<void>;
  updateKhutbah: (id: string, k: Partial<Khutbah>) => Promise<void>;
  deleteKhutbah: (id: string) => Promise<void>;
  azkar: Dhikr[];
  addDhikr: (d: Omit<Dhikr, "id">) => void;
  updateDhikr: (id: string, d: Partial<Dhikr>) => void;
  deleteDhikr: (id: string) => void;
  categories: Category[];
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  hadithOfDay: string;
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

const seedCategories: Category[] = [
  { id: "c1", name: "الإيمان" },
  { id: "c2", name: "الأخلاق" },
  { id: "c3", name: "العبادات" },
  { id: "c4", name: "الأسرة" },
];

const seedKhutab: Khutbah[] = [
  {
    id: "k1",
    title: "فضل تقوى الله",
    category: "الإيمان",
    date: "1447/05/12",
    content:
      "الحمد لله رب العالمين، والصلاة والسلام على أشرف الأنبياء والمرسلين، نبينا محمد وعلى آله وصحبه أجمعين. أما بعد: فأوصيكم عباد الله ونفسي بتقوى الله، فإن تقوى الله جماع الخير كله، بها تُستجلب الأرزاق، وتُدفع البلايا، وتُفتح أبواب الرحمة. قال تعالى: ﴿وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ﴾. فاتقوا الله عباد الله، واعلموا أن التقوى ليست شعارًا يُرفع، بل عمل بالجوارح وإخلاص في القلب...",
  },
  {
    id: "k2",
    title: "حسن الخلق مع الناس",
    category: "الأخلاق",
    date: "1447/05/05",
    content:
      "إن من أعظم ما يتحلى به المسلم حسن الخلق، فقد قال النبي ﷺ: «إنما بُعثت لأتمم مكارم الأخلاق». وحسن الخلق طريق إلى محبة الله ومحبة الناس، وهو ميزان ثقيل يوم القيامة. فليحرص كل مسلم على تطييب لسانه، وكف أذاه، وبسط وجهه للناس...",
  },
  {
    id: "k3",
    title: "أهمية الصلاة في وقتها",
    category: "العبادات",
    date: "1447/04/28",
    content:
      "الصلاة عمود الدين، ومن حافظ عليها حافظ على دينه، ومن ضيّعها فهو لما سواها أضيع. سُئل النبي ﷺ: أيُّ العمل أحب إلى الله؟ قال: «الصلاة على وقتها». فاتقوا الله واحفظوا صلواتكم...",
  },
];

const seedAzkar: Dhikr[] = [
  { id: "z1", title: "سيد الاستغفار", text: "اللّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.", count: 1, category: "أذكار الصباح" },
  { id: "z2", title: "أصبحنا وأصبح الملك لله", text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 1, category: "أذكار الصباح" },
  { id: "z3", title: "سبحان الله وبحمده", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.", count: 100, category: "التسبيح" },
  { id: "z4", title: "أمسينا وأمسى الملك لله", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.", count: 1, category: "أذكار المساء" },
  { id: "z5", title: "دعاء دخول المنزل", text: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا.", count: 1, category: "أدعية متنوعة" },
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
  const [khutab, setKhutab] = useLS<Khutbah[]>("zad.khutab", seedKhutab);
  const [azkar, setAzkar] = useLS<Dhikr[]>("zad.azkar", seedAzkar);
  const [categories, setCategories] = useLS<Category[]>("zad.cats", seedCategories);
  const [hadithOfDay, setHadithOfDay] = useLS<string>("zad.hadith", seedHadith);
  const [favorites, setFavorites] = useLS<Favorite[]>("zad.favs", []);
  const [isAdmin, setIsAdmin] = useLS<boolean>("zad.admin", false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", nightMode);
  }, [nightMode]);

  const value: Store = {
    fontScale,
    setFontScale,
    nightMode,
    toggleNight: () => setNightMode((v) => !v),
    khutab,
    addKhutbah: (k) => setKhutab((p) => [{ ...k, id: uid() }, ...p]),
    updateKhutbah: (id, k) => setKhutab((p) => p.map((x) => (x.id === id ? { ...x, ...k } : x))),
    deleteKhutbah: (id) => setKhutab((p) => p.filter((x) => x.id !== id)),
    azkar,
    addDhikr: (d) => setAzkar((p) => [{ ...d, id: uid() }, ...p]),
    updateDhikr: (id, d) => setAzkar((p) => p.map((x) => (x.id === id ? { ...x, ...d } : x))),
    deleteDhikr: (id) => setAzkar((p) => p.filter((x) => x.id !== id)),
    categories,
    addCategory: (name) => setCategories((p) => [...p, { id: uid(), name }]),
    deleteCategory: (id) => setCategories((p) => p.filter((c) => c.id !== id)),
    hadithOfDay,
    setHadithOfDay,
    favorites,
    toggleFavorite: (f) =>
      setFavorites((p) => (p.some((x) => x.id === f.id) ? p.filter((x) => x.id !== f.id) : [f, ...p])),
    isFavorite: (id) => favorites.some((x) => x.id === id),
    isAdmin,
    loginAdmin: (pw) => {
      if (pw === "77salmanfares77ss") {
        setIsAdmin(true);
        return true;
      }
      return false;
    },
    logoutAdmin: () => setIsAdmin(false),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within AppStoreProvider");
  return c;
}
