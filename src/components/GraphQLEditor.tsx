
import * as React from "react";
import Prism from "prismjs";
import "prismjs/components/prism-graphql";
import "./prism-custom.css"; // We'll create this file for custom styling

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  onExecute?: () => void;
}

export default function GraphQLEditor({ value, onChange, disabled, onExecute }: Props) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const preRef = React.useRef<HTMLPreElement>(null);
  
  React.useEffect(() => {
    if (preRef.current) {
      preRef.current.textContent = value;
      Prism.highlightElement(preRef.current);
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Tab for indentation
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
    
    // Ctrl+Enter to execute query
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && onExecute) {
      e.preventDefault();
      onExecute();
    }
  };
  
  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full">
        <pre 
          ref={preRef} 
          className="w-full absolute top-0 left-0 pointer-events-none rounded-lg border border-gray-200 px-4 py-3 text-base min-h-[240px] overflow-hidden font-mono bg-white"
          style={{ margin: 0 }}
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={10}
          spellCheck={false}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 font-mono text-base resize-vertical min-h-[240px] focus:ring-2 focus:ring-blue-400 outline-none text-transparent bg-transparent"
          placeholder="Введите GraphQL-запрос..."
          style={{ caretColor: "#000000" }}
          autoFocus
        />
      </div>
      <button
        onClick={onExecute}
        disabled={disabled}
        className="w-full md:w-auto px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 shadow text-white font-semibold text-lg transition text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? "Успешно!" : "Выполнить"}
      </button>
    </div>
  );
}
