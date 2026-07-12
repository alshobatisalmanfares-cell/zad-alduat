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

// Expanded authentic Azkar (from Hisn al-Muslim). LS key bumped to v3 to force refresh.
const seedAzkar: Dhikr[] = [
  // ============ أذكار الصباح ============
  { id: "sm1", category: "أذكار الصباح", count: 1, title: "آية الكرسي", text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ." },
  { id: "sm2", category: "أذكار الصباح", count: 3, title: "المعوذات", text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ… قُلْ أَعُوذُ بِرَبِّ النَّاسِ…" },
  { id: "sm3", category: "أذكار الصباح", count: 1, title: "أصبحنا وأصبح الملك لله", text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ." },
  { id: "sm4", category: "أذكار الصباح", count: 1, title: "اللهم بك أصبحنا", text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ." },
  { id: "sm5", category: "أذكار الصباح", count: 1, title: "سيد الاستغفار", text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ." },
  { id: "sm6", category: "أذكار الصباح", count: 4, title: "اللهم إني أصبحت أشهدك", text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ." },
  { id: "sm7", category: "أذكار الصباح", count: 3, title: "اللهم عافني في بدني", text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ." },
  { id: "sm8", category: "أذكار الصباح", count: 3, title: "حسبي الله", text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ." },
  { id: "sm9", category: "أذكار الصباح", count: 3, title: "بسم الله الذي لا يضر مع اسمه شيء", text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ." },
  { id: "sm10", category: "أذكار الصباح", count: 3, title: "رضيت بالله ربًا", text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا." },
  { id: "sm11", category: "أذكار الصباح", count: 100, title: "سبحان الله وبحمده", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ." },
  { id: "sm12", category: "أذكار الصباح", count: 10, title: "لا إله إلا الله وحده لا شريك له", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ." },
  { id: "sm13", category: "أذكار الصباح", count: 1, title: "اللهم عالم الغيب والشهادة", text: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ." },

  // ============ أذكار المساء ============
  { id: "ev1", category: "أذكار المساء", count: 1, title: "أمسينا وأمسى الملك لله", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا." },
  { id: "ev2", category: "أذكار المساء", count: 1, title: "اللهم بك أمسينا", text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ." },
  { id: "ev3", category: "أذكار المساء", count: 3, title: "أعوذ بكلمات الله التامات", text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ." },
  { id: "ev4", category: "أذكار المساء", count: 3, title: "المعوذات مساءً", text: "قُلْ هُوَ اللَّهُ أَحَدٌ… قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ… قُلْ أَعُوذُ بِرَبِّ النَّاسِ… (ثلاث مرات)" },
  { id: "ev5", category: "أذكار المساء", count: 1, title: "اللهم إني أمسيت أشهدك", text: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ." },
  { id: "ev6", category: "أذكار المساء", count: 100, title: "سبحان الله وبحمده مساءً", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ." },
  { id: "ev7", category: "أذكار المساء", count: 3, title: "أستغفر الله وأتوب إليه", text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ." },

  // ============ أذكار النوم ============
  { id: "sl1", category: "أذكار النوم", count: 1, title: "باسمك ربي وضعت جنبي", text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ." },
  { id: "sl2", category: "أذكار النوم", count: 1, title: "اللهم قني عذابك", text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ." },
  { id: "sl3", category: "أذكار النوم", count: 1, title: "باسمك اللهم أموت وأحيا", text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا." },
  { id: "sl4", category: "أذكار النوم", count: 33, title: "سبحان الله (تسبيح النوم)", text: "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)." },
  { id: "sl5", category: "أذكار النوم", count: 1, title: "دعاء النوم الجامع", text: "اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَرَبَّ الْأَرْضِ، وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنَزِّلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ." },

  // ============ أذكار الاستيقاظ ============
  { id: "wk1", category: "أذكار الاستيقاظ", count: 1, title: "الحمد لله الذي أحيانا", text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ." },
  { id: "wk2", category: "أذكار الاستيقاظ", count: 1, title: "لا إله إلا الله وحده", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ." },

  // ============ أذكار الصلاة ============
  { id: "pr1", category: "أذكار الصلاة", count: 1, title: "دعاء الاستفتاح", text: "اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ." },
  { id: "pr2", category: "أذكار الصلاة", count: 1, title: "التشهد", text: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ." },
  { id: "pr3", category: "أذكار الصلاة", count: 1, title: "الصلاة الإبراهيمية", text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ." },
  { id: "pr4", category: "أذكار الصلاة", count: 33, title: "أذكار بعد السلام", text: "أَسْتَغْفِرُ اللَّهَ (٣). اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ. سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)." },
  { id: "pr5", category: "أذكار الصلاة", count: 1, title: "دعاء بين السجدتين", text: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي." },

  // ============ أدعية مأثورة ============
  { id: "du1", category: "أدعية مأثورة", count: 1, title: "دعاء الهم والحزن", text: "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي." },
  { id: "du2", category: "أدعية مأثورة", count: 1, title: "دعاء الكرب", text: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ." },
  { id: "du3", category: "أدعية مأثورة", count: 1, title: "دعاء الاستخارة", text: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ…" },
  { id: "du4", category: "أدعية مأثورة", count: 1, title: "دعاء دخول المنزل", text: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا." },
  { id: "du5", category: "أدعية مأثورة", count: 1, title: "دعاء الخروج من المنزل", text: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ." },
  { id: "du6", category: "أدعية مأثورة", count: 1, title: "دعاء دخول المسجد", text: "أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ." },
  { id: "du7", category: "أدعية مأثورة", count: 1, title: "دعاء الخروج من المسجد", text: "بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ، اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ." },
  { id: "du8", category: "أدعية مأثورة", count: 1, title: "دعاء قبل الطعام", text: "بِسْمِ اللَّهِ، وَإِنْ نَسِيتَ فِي أَوَّلِهِ فَقُلْ: بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ." },
  { id: "du9", category: "أدعية مأثورة", count: 1, title: "دعاء بعد الطعام", text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ." },
  { id: "du10", category: "أدعية مأثورة", count: 1, title: "دعاء السفر", text: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى." },
  { id: "du11", category: "أدعية مأثورة", count: 1, title: "دعاء لبس الثوب", text: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا الثَّوْبَ، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ." },
  { id: "du12", category: "أدعية مأثورة", count: 1, title: "دعاء دخول الخلاء", text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ." },
  { id: "du13", category: "أدعية مأثورة", count: 1, title: "دعاء الخروج من الخلاء", text: "غُفْرَانَكَ." },
  { id: "du14", category: "أدعية مأثورة", count: 1, title: "دعاء لبس الثوب الجديد", text: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ خَيْرَهُ وَخَيْرَ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ." },

  // ============ التسبيح ============
  { id: "ts1", category: "التسبيح", count: 100, title: "سبحان الله وبحمده", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ." },
  { id: "ts2", category: "التسبيح", count: 100, title: "لا إله إلا الله وحده لا شريك له", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ." },
  { id: "ts3", category: "التسبيح", count: 100, title: "سبحان الله العظيم", text: "سُبْحَانَ اللَّهِ الْعَظِيمِ." },
  { id: "ts4", category: "التسبيح", count: 100, title: "لا حول ولا قوة إلا بالله", text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ." },
  { id: "ts5", category: "التسبيح", count: 100, title: "الاستغفار", text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ." },
  { id: "ts6", category: "التسبيح", count: 100, title: "الصلاة على النبي ﷺ", text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ." },
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
  const [azkar, setAzkar] = useLS<Dhikr[]>("zad.azkar.v3", seedAzkar);
  const [categories, setCategories] = useLS<Category[]>("zad.cats", seedCategories);
  const [hadithOfDay, setHadithLocal] = useState<string>(seedHadith);

  const [favorites, setFavorites] = useLS<Favorite[]>("zad.favs", []);
  const [isAdmin, setIsAdmin] = useLS<boolean>("zad.admin", false);
  // Persist admin password locally so mutations survive reloads (bugfix: "Not authenticated").
  const [adminPassword, setAdminPassword] = useLS<string | null>("zad.adminpw", null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", nightMode);
  }, [nightMode]);

  // Initial fetch + realtime sync from Supabase
  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ data: kh }, { data: st }] = await Promise.all([
        supabase.from("khutab").select("*").order("created_at", { ascending: false }),
        supabase.from("app_settings").select("value").eq("key", "hadith_of_day").maybeSingle(),
      ]);
      if (!alive) return;
      if (kh) setKhutab(kh as Khutbah[]);
      if (st?.value) setHadithLocal(st.value);
    })().catch(() => {});

    const ch = supabase
      .channel("zad-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "khutab" }, async () => {
        const { data } = await supabase.from("khutab").select("*").order("created_at", { ascending: false });
        if (data) setKhutab(data as Khutbah[]);
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
    addKhutbah: async (k) => {
      await adminMutate({ data: { password: requirePw(), action: "khutbah.create", data: k } });
    },
    updateKhutbah: async (id, k) => {
      await adminMutate({ data: { password: requirePw(), action: "khutbah.update", id, data: k } });
    },
    deleteKhutbah: async (id) => {
      await adminMutate({ data: { password: requirePw(), action: "khutbah.delete", id } });
    },
    azkar,
    addDhikr: (d) => setAzkar((p) => [{ ...d, id: uid() }, ...p]),
    updateDhikr: (id, d) => setAzkar((p) => p.map((x) => (x.id === id ? { ...x, ...d } : x))),
    deleteDhikr: (id) => setAzkar((p) => p.filter((x) => x.id !== id)),
    categories,
    addCategory: (name) => setCategories((p) => [...p, { id: uid(), name }]),
    deleteCategory: (id) => setCategories((p) => p.filter((c) => c.id !== id)),
    hadithOfDay,
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
