import type { SendErrorBannerProps } from "~/interface/message.interface";

export default function SendErrorBanner({ error, className = "mx-4 mt-2" }: SendErrorBannerProps) {
  if (!error) return null;

  return (
    <div className={`${className} px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-[13px] text-red-400 font-medium`}>
      {error}
    </div>
  );
}
