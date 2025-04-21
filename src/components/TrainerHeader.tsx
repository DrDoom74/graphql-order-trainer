
import { ArrowRight } from "lucide-react";
import * as React from "react";
import SchemaDialog from "./SchemaDialog";

export default function TrainerHeader({ onLinkClick }: { onLinkClick?: () => void }) {
  const [schemaOpen, setSchemaOpen] = React.useState(false);

  return (
    <header className="bg-white flex items-center justify-between px-4 py-2 border-b border-gray-200 gap-4 flex-wrap sm:flex-nowrap relative">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1 text-left">
        GraphQL тренажёр: Заказы пользователя
      </h1>
      <nav className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 text-blue-700 font-medium px-3 py-2 text-base hover:bg-blue-100 active:bg-blue-200 transition border border-blue-100 shadow-sm"
          onClick={() => setSchemaOpen(true)}
        >
          <span role="img" aria-label="schema" className="text-lg">📘</span>
          <span className="hidden sm:inline">Схема API</span>
        </button>
        <a
          href="https://boosty.to/aklimenko"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-blue-500 text-white font-medium px-4 py-2 text-base hover:bg-blue-600 transition shadow animate-fade-in"
          onClick={onLinkClick}
        >
          <span>Ответы</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </a>
      </nav>
      <SchemaDialog open={schemaOpen} onOpenChange={setSchemaOpen} />
    </header>
  );
}

