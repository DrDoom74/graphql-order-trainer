
import * as React from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export default function GraphQLEditor({ value, onChange, disabled }: Props) {
  return (
    <div className="w-full h-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={10}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-base resize-vertical min-h-[120px] focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50"
        placeholder="Введите GraphQL-запрос..."
        autoFocus
      />
    </div>
  );
}
