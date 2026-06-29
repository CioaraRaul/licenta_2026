import { useLanguageStore, type Lang } from "~/store/language.store";
import { useTranslation } from "~/hooks/useTranslation";

const LANG_OPTIONS: { value: Lang; flag: string }[] = [
  { value: "en", flag: "🇬🇧" },
  { value: "ro", flag: "🇷🇴" },
];

export default function LanguageTab() {
  const { lang, setLang } = useLanguageStore();
  const t = useTranslation();
  const tl = t.settings.language;

  const labels: Record<Lang, { label: string; desc: string }> = {
    en: { label: tl.english, desc: tl.englishDesc },
    ro: { label: tl.romanian, desc: tl.romanianDesc },
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-[#f5f5f7]">
            {tl.title}
          </h3>
          <p className="text-[12px] text-[#8e8e9a] mt-0.5">{tl.subtitle}</p>
        </div>

        <div className="p-5 grid grid-cols-2 gap-3">
          {LANG_OPTIONS.map(({ value, flag }) => {
            const isActive = lang === value;
            return (
              <button
                key={value}
                onClick={() => setLang(value)}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${
                  isActive
                    ? "border-[#e63946]/40 bg-[#e63946]/5"
                    : "border-white/[0.04] hover:border-white/[0.08] bg-white/[0.02]"
                }`}
              >
                <span className="text-4xl leading-none">{flag}</span>
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-[#f5f5f7]">
                    {labels[value].label}
                  </p>
                  <p className="text-[11px] text-[#8e8e9a] mt-0.5">
                    {labels[value].desc}
                  </p>
                </div>
                {isActive && (
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#e63946] flex items-center justify-center">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[#e63946]/15 text-[#e63946]"
                      : "bg-white/[0.04] text-[#8e8e9a]"
                  }`}
                >
                  {isActive ? tl.active : tl.select}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
