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
  // States
  const [current, setCurrent] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>(
    Array(tasks.length).fill("")
  );
  const [correct, setCorrect] = React.useState<boolean[]>(
    Array(tasks.length).fill(false)
  );
  const [error, setError] = React.useState<string | undefined>();
  const [result, setResult] = React.useState<unknown | null>(null);
  const [isSandboxMode, setIsSandboxMode] = React.useState(false);
  const [isTaskInvalid, setIsTaskInvalid] = React.useState(false);

  const task = tasks[current];

  React.useEffect(() => {
    setError(undefined);
    setResult(null);
    setIsTaskInvalid(false);
    // If already solved and there is an answer - show the result
    if (correct[current] && answers[current]) {
      setResult(
        task.getExpectedData(orders)
      );
    }
  }, [current, isSandboxMode]);

  // Toggle "Sandbox" mode
  const toggleSandboxMode = () => {
    setIsSandboxMode(prev => !prev);
    setError(undefined);
    setResult(null);
    setIsTaskInvalid(false);
  };

  // Validate arguments in the query
  const validateArguments = (query: string): { valid: boolean; error?: string } => {
    // Check for invalid types in arguments
    const numericArgsRegex = /(?:limit|offset):\s*["']?([^0-9\s,)}]*)["']?/g;
    let match;
    
    while ((match = numericArgsRegex.exec(query)) !== null) {
      if (match[1] && isNaN(Number(match[1]))) {
        return { 
          valid: false, 
          error: "Ошибка в аргументах запроса: limit и offset должны быть числами." 
        };
      }
    }
    
    return { valid: true };
  };

  // Run query handler
  function handleRun() {
    setError(undefined);
    setIsTaskInvalid(false);
    
    const val = answers[isSandboxMode ? 0 : current];
    const gqlCheck = validateGQL(val);
    
    if (!gqlCheck.valid) {
      setResult(null);
      setError(gqlCheck.error);
      return;
    }

    // Validate arguments
    const argsCheck = validateArguments(val);
    if (!argsCheck.valid) {
      setResult(null);
      setError(argsCheck.error);
      return;
    }

    // In sandbox mode, just show the query result
    if (isSandboxMode) {
      try {
        // Try to execute the query against mock data
        // Simple simulation of query processing on the client
        const queryMatch = val.match(/{\s*orders\s*\(/);
        if (queryMatch) {
          setResult(orders);
        } else {
          setError("Запрос должен содержать { orders(...) }");
        }
      } catch (err) {
        setError(String(err));
      }
      return;
    }

    // Additional validation for task structure
    if (!correct[current] && !task.validate(val)) {
      setResult(task.getInvalidData(orders));
      setIsTaskInvalid(true);
      return;
    }
    
    // Success!
    if (!correct[current]) {
      const newCorrect = [...correct];
      newCorrect[current] = true;
      setCorrect(newCorrect);

      const newAnswers = [...answers];
      newAnswers[current] = val;
      setAnswers(newAnswers);
    }

    setError(undefined);
    setResult(task.getExpectedData(orders));
  }

  function handleEditorChange(text: string) {
    const newAnswers = [...answers];
    if (isSandboxMode) {
      newAnswers[0] = text;
    } else {
      newAnswers[current] = text;
    }
    setAnswers(newAnswers);
    
    // Only clear errors when editing, but keep the result displayed
    setError(undefined);
    setIsTaskInvalid(false);
  }

  function prev() {
    if (isSandboxMode) return;
    setCurrent((c) => (c === 0 ? 0 : c - 1));
  }
  
  function next() {
    if (isSandboxMode) return;
    setCurrent((c) => (c + 1) % tasks.length);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <TrainerHeader 
        onToggleSandbox={toggleSandboxMode} 
        isSandboxMode={isSandboxMode} 
      />
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-1 py-4 sm:py-8 gap-4">
        {!isSandboxMode && (
          <TrainerTaskNav current={current} correctList={correct} onPrev={prev} onNext={next} />
        )}
        
        {isSandboxMode ? (
          <section className="mb-3 w-full bg-white rounded-xl p-4 shadow-sm flex flex-col items-start">
            <div className="flex flex-row items-center gap-3 py-2 w-full">
              <span className="text-lg font-medium text-gray-800">🧪 Режим песочницы</span>
              <span className="text-sm text-gray-600">Свободное экспериментирование с GraphQL-запросами</span>
            </div>
          </section>
        ) : (
          <section className="mb-3 w-full bg-white rounded-xl p-4 shadow-sm flex flex-col items-start">
            <div className="flex flex-row items-center gap-3 py-2 w-full">
              <span className="text-lg font-medium text-gray-800">{task.title}</span>
            </div>
          </section>
        )}
        
        {/* Editor-output block */}
        <section
          className="w-full flex-1 flex gap-4 flex-col md:flex-row"
        >
          <div className="flex-1 flex flex-col">
            <div className="font-semibold mb-2 text-gray-700">Ввод запроса</div>
            <GraphQLEditor
              value={answers[isSandboxMode ? 0 : current]}
              onChange={handleEditorChange}
              disabled={false} // No longer disabling after completion
              onExecute={handleRun}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="font-semibold mb-2 text-gray-700">Результат выполнения</div>
            <GraphQLResult 
              result={result} 
              error={error} 
              isTaskComplete={!isSandboxMode && correct[current]}
              isTaskInvalid={isTaskInvalid}
            />
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
