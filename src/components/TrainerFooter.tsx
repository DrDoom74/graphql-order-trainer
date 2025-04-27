
import { Link } from "lucide-react";

export default function TrainerFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-3 text-center mt-auto flex items-center justify-center">
      <span className="font-semibold text-gray-900">Школа Алексея Клименко</span>
      <span className="mx-2 text-gray-400">|</span>
      <a 
        href="https://t.me/QA_AKlimenko" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center text-gray-400 hover:text-blue-600 transition-colors"
      >
        <Link className="mr-1 size-4" />
        <span className="text-sm">Telegram</span>
      </a>
      <span className="mx-2 text-gray-400">|</span>
      <span className="text-gray-400 text-sm">© 2025</span>
    </footer>
  );
}
