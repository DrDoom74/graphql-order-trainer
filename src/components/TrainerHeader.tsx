
import { ArrowRight, HelpCircle } from "lucide-react";
import * as React from "react";
import SchemaDialog from "./SchemaDialog";
import HintDialog from "./HintDialog";
import { Button } from "@/components/ui/button";

export default function TrainerHeader({ onLinkClick, onToggleSandbox, isSandboxMode }: { 
  onLinkClick?: () => void,
  onToggleSandbox?: () => void,
  isSandboxMode?: boolean
}) {
  const [schemaOpen, setSchemaOpen] = React.useState(false);
  const [hintOpen, setHintOpen] = React.useState(false);

  return (
    <header className="bg-white flex items-center justify-between px-4 py-2 border-b border-gray-200 gap-4 flex-wrap sm:flex-nowrap relative">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1 text-left">
        GraphQL тренажёр: Заказы пользователя
      </h1>
      <nav className="flex items-center gap-2 sm:gap-4">
        <Button
          type="button"
          variant="outline"
          className="items-center gap-1 !px-3 py-2"
          onClick={() => setSchemaOpen(true)}
        >
          <span role="img" aria-label="schema" className="text-lg">📘</span>
          <span className="hidden sm:inline">Схема API</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="items-center gap-1 !px-3 py-2"
          onClick={() => setHintOpen(true)}
        >
          <HelpCircle className="inline w-4 h-4" />
          <span className="hidden sm:inline">Подсказка</span>
        </Button>
        {onToggleSandbox && (
          <Button
            type="button"
            variant={isSandboxMode ? "default" : "outline"}
            className="items-center gap-1 !px-3 py-2"
            onClick={onToggleSandbox}
          >
            <span role="img" aria-label="sandbox" className="text-lg">🧪</span>
            <span className="hidden sm:inline">Песочница</span>
          </Button>
        )}
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
      <HintDialog open={hintOpen} onOpenChange={setHintOpen} />
    </header>
  );
}
