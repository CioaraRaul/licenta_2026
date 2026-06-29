import { useLanguageStore } from "~/store/language.store";
import { translations } from "~/i18n/translations";

export function useTranslation() {
  const lang = useLanguageStore((s) => s.lang);
  return translations[lang];
}
