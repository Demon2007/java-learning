import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLangStore = create(
  persist(
    (set) => ({
      lang: "ru",
      setLang: (lang) => set({ lang }),
      toggle: () => set((s) => ({ lang: s.lang === "en" ? "ru" : "en" })),
    }),
    { name: "javaquest-lang" }
  )
);

export default useLangStore;
