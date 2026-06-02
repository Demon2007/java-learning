import useLangStore from "@/store/langStore";
import en from "@/i18n/en";
import ru from "@/i18n/ru";

const dict = { en, ru };

export function useT() {
  const { lang } = useLangStore();
  const t = dict[lang] ?? dict.en;

  return (key) => {
    const parts = key.split(".");
    let result = t;
    for (const part of parts) {
      result = result?.[part];
      if (result === undefined) return key;
    }
    return result;
  };
}
