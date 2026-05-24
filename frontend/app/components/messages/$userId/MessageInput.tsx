import { useState, useRef, useEffect } from "react";
import type { MessageInputProps } from "~/interface/message.interface";
import { SendIcon } from "../icons";

export default function MessageInput({ onSendMessage, autoFocus }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-3 border-t border-white/[0.04] flex items-end gap-3"
    >
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-[#f5f5f7] placeholder-[#555] outline-none resize-none min-h-[40px] max-h-[120px] focus:border-[#e63946]/40 transition-colors"
      />
      <button
        type="submit"
        disabled={!inputValue.trim()}
        className="shrink-0 w-10 h-10 rounded-xl bg-[#e63946] hover:bg-[#d62836] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        title="Send message"
      >
        <SendIcon />
      </button>
    </form>
  );
}
