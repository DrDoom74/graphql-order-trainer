
import * as React from "react";
import TrainerHeader from "@/components/TrainerHeader";
import TrainerFooter from "@/components/TrainerFooter";
import TrainerTaskNav from "@/components/TrainerTaskNav";
import GraphQLEditor from "@/components/GraphQLEditor";
import GraphQLResult from "@/components/GraphQLResult";
import { orders } from "@/data/orders-mock";
import { tasks } from "@/data/tasks";
import { validateGQL } from "@/utils/graphql-validate";

export default function Index() {
  // Стейты
  const [current, setCurrent] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>(
    Array(tasks.length).fill("")
  );
  const [correct, setCorrect] = React.useState<boolean[]>(
    Array(tasks.length).fill(false)
  );
  const [error, setError] = React.useState<string | undefined>();
  const [result, setResult] = React.useState<unknown | null>(null);

  const task = tasks[current];

  React.useEffect(() => {
    setError(undefined);
    setResult(null);
    // Если уже решено и есть ответ — показываем результат
    if (correct[current] && answers[current]) {
      setResult(
        task.getExpectedData(orders)
      );
    }
  }, [current]);

  // Проверка: разрешаем только select запросы
  function handleRun() {
    setError(undefined);
    const val = answers[current];
    const gqlCheck = validateGQL(val);
    if (!gqlCheck.valid) {
      setResult(null);
      setError(gqlCheck.error);
      return;
    }
    // Доп. валидация на структуру задания
    if (!task.validate(val)) {
      setResult(null);
      setError("Проверь поля и структуру запроса согласно заданию");
      return;
    }
    // Успех!
    const newCorrect = [...correct];
    newCorrect[current] = true;
    setCorrect(newCorrect);

    const newAnswers = [...answers];
    newAnswers[current] = val;
    setAnswers(newAnswers);

    setError(undefined);
    setResult(task.getExpectedData(orders));
  }

  function handleEditorChange(text: string) {
    const newAnswers = [...answers];
    newAnswers[current] = text;
    setAnswers(newAnswers);
    setError(undefined);
    setResult(null);
    // Сбросить “галочку” для текущего задания (можно вернуть если нужно).
    // Но сейчас — пусть снимается, если изменили ответ
    if (correct[current]) {
      const newCorrect = [...correct];
      newCorrect[current] = false;
      setCorrect(newCorrect);
    }
  }

  function prev() {
    setCurrent((c) => (c === 0 ? 0 : c - 1));
  }
  function next() {
    setCurrent((c) => (c + 1) % tasks.length);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <TrainerHeader />
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-1 py-4 sm:py-8 gap-4">
        <TrainerTaskNav current={current} correctList={correct} onPrev={prev} onNext={next} />
        <section className="mb-3 w-full bg-white rounded-xl p-4 shadow-sm flex flex-col items-start">
          <div className="flex flex-row items-center gap-3 py-2 w-full">
            <span className="text-lg font-medium text-gray-800">{task.title}</span>
          </div>
        </section>
        {/* Блок редактор-вывод */}
        <section
          className="w-full flex-1 flex gap-4 flex-col md:flex-row"
        >
          <div className="flex-1 flex flex-col">
            <div className="font-semibold mb-2 text-gray-700">Ввод запроса</div>
            <GraphQLEditor
              value={answers[current]}
              onChange={handleEditorChange}
              disabled={correct[current]}
            />
            <button
              className="mt-3 w-full md:w-auto px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 shadow text-white font-semibold text-lg transition text-center animate-scale-in"
              onClick={handleRun}
              disabled={correct[current]}
            >
              {correct[current] ? "Успешно!" : "Выполнить"}
            </button>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="font-semibold mb-2 text-gray-700">Результат выполнения</div>
            <GraphQLResult result={result} error={error} />
          </div>
        </section>
      </main>
      <TrainerFooter />
      {/* mobile UX hint */}
      <style>{`
        @media (max-width: 767px) {
          main > section.w-full.flex-1 {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}

