
import * as React from "react";
import Prism from "prismjs";
import "prismjs/components/prism-graphql";
import "./prism-custom.css"; // Using custom styling

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  onExecute?: () => void;
}

export default function GraphQLEditor({ value, onChange, disabled, onExecute }: Props) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const preRef = React.useRef<HTMLPreElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Update syntax highlighting when value changes
  React.useEffect(() => {
    if (preRef.current) {
      preRef.current.textContent = value;
      Prism.highlightElement(preRef.current);
    }
  }, [value]);

  // Ensure text wrapping and scrolling on resize
  React.useEffect(() => {
    const handleResize = () => {
      if (preRef.current && textareaRef.current && containerRef.current) {
        // Force re-render of content to ensure proper wrapping
        preRef.current.textContent = value;
        Prism.highlightElement(preRef.current);
        
        // Initial sync of scroll position
        syncScroll();
      }
    };
    
    // Sync scroll positions between pre and textarea
    const syncScroll = () => {
      if (preRef.current && textareaRef.current) {
        preRef.current.scrollTop = textareaRef.current.scrollTop;
        preRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
    };
    
    // Create a resize observer to watch for container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Add scroll event listener
    if (textareaRef.current) {
      textareaRef.current.addEventListener('scroll', syncScroll);
    }
    
    // Initial call to handleResize
    handleResize();
    
    return () => {
      resizeObserver.disconnect();
      textareaRef.current?.removeEventListener('scroll', syncScroll);
    };
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
  
  // Sync scroll between textarea and pre elements
  const handleScroll = () => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };
  
  return (
    <div className="flex flex-col gap-3">
      <div ref={containerRef} className="relative w-full">
        <pre 
          ref={preRef} 
          className="language-graphql w-full absolute top-0 left-0 pointer-events-none rounded-lg border border-gray-200 px-4 py-3 text-base min-h-[240px] overflow-auto font-mono bg-white whitespace-pre-wrap break-words"
          style={{ 
            margin: 0, 
            wordWrap: "break-word", 
            overflowWrap: "break-word",
            overflowY: "auto",
            maxHeight: "100%"
          }}
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          disabled={disabled}
          rows={10}
          spellCheck={false}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 font-mono text-base resize-vertical min-h-[240px] focus:ring-2 focus:ring-blue-400 outline-none text-transparent bg-transparent whitespace-pre-wrap break-words overflow-auto"
          placeholder="Введите GraphQL-запрос..."
          style={{ 
            caretColor: "#000000", 
            wordWrap: "break-word", 
            overflowWrap: "break-word",
            overflowY: "auto"
          }}
          autoFocus
        />
      </div>
      <button
        onClick={onExecute}
        disabled={disabled}
        className="w-full md:w-auto px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 shadow text-white font-semibold text-lg transition text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Выполнить
      </button>
    </div>
  );
}
