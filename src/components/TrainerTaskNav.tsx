
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { tasks } from "@/data/tasks";

interface Props {
  current: number;
  correctList: boolean[];
  onPrev: () => void;
  onNext: () => void;
}

export default function TrainerTaskNav({ current, correctList, onPrev, onNext }: Props) {
  return (
    <nav className="w-full flex items-center justify-between py-2 px-2 sm:px-6 bg-blue-50 rounded-xl mb-4 shadow-sm animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="font-medium text-blue-900 text-base sm:text-lg">
          📘 Задание {current + 1} из {tasks.length}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          title="Назад"
          className="px-3 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-xl transition"
          onClick={onPrev}
        >
          <ArrowLeft />
        </button>
        <button
          title="Вперед"
          className="px-3 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-xl transition"
          onClick={onNext}
        >
          <ArrowRight />
        </button>
        {correctList[current] && (
          <span className="ml-3 flex items-center text-green-600 text-xl font-bold animate-scale-in">
            <Check className="mr-1" /> Готово
          </span>
        )}
      </div>
    </nav>
  );
}
