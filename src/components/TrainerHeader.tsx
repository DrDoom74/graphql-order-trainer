
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

export default function TrainerHeader({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <header className="bg-white flex items-center justify-between px-4 py-2 border-b border-gray-200 gap-4 flex-wrap sm:flex-nowrap">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1 text-left">
        GraphQL тренажёр: Заказы пользователя
      </h1>
      <a
        href="https://boosty.to/aklimenko"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-lg bg-blue-500 text-white font-medium px-4 py-2 text-base hover:bg-blue-600 transition shadow hover-scale animate-fade-in"
        onClick={onLinkClick}
      >
        <span>Ответы на Boosty</span>
        <ArrowRight className="ml-2 w-5 h-5" />
      </a>
    </header>
  );
}

