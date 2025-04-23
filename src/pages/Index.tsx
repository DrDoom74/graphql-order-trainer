
import * as React from "react";
import TrainerHeader from "@/components/TrainerHeader";
import TrainerFooter from "@/components/TrainerFooter";
import TrainerTaskNav from "@/components/TrainerTaskNav";
import GraphQLEditor from "@/components/GraphQLEditor";
import GraphQLResult from "@/components/GraphQLResult";
import AvailableUsers from "@/components/AvailableUsers";
import { useTaskState } from "@/hooks/useTaskState";

export default function Index() {
  const [isSandboxMode, setIsSandboxMode] = React.useState(false);
  const { 
    current,
    answers,
    correct,
    error,
    result,
    isTaskInvalid,
    isLoading,
    task,
    handleRun,
    handleEditorChange,
    prev,
    next
  } = useTaskState(isSandboxMode);

  const toggleSandboxMode = () => {
    setIsSandboxMode(prev => !prev);
  };

  function handleCopyUserId(userId: string) {
    const editor = document.querySelector('textarea') as HTMLTextAreaElement;
    if (editor) {
      const userIdString = `"${userId}"`;
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const currentVal = answers[isSandboxMode ? 0 : current];
      const newValue = currentVal.substring(0, start) + userIdString + currentVal.substring(end);
      handleEditorChange(newValue);
      
      setTimeout(() => {
        editor.focus();
        const newPosition = start + userIdString.length;
        editor.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
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
            <div className="flex items-center mt-2">
              <AvailableUsers onCopyUserId={handleCopyUserId} />
              <span className="text-sm text-gray-500">← Получить список доступных пользователей</span>
            </div>
          </section>
        ) : (
          <section className="mb-3 w-full bg-white rounded-xl p-4 shadow-sm flex flex-col items-start">
            <div className="flex flex-row items-center gap-3 py-2 w-full">
              <span className="text-lg font-medium text-gray-800">{task.title}</span>
            </div>
            <div className="flex items-center mt-2">
              <AvailableUsers onCopyUserId={handleCopyUserId} />
              <span className="text-sm text-gray-500">← Получить список доступных пользователей</span>
            </div>
          </section>
        )}
        
        <section className="w-full flex-1 flex gap-4 flex-col md:flex-row">
          <div className="flex-1 flex flex-col">
            <div className="font-semibold mb-2 text-gray-700">Ввод запроса</div>
            <GraphQLEditor
              value={answers[isSandboxMode ? 0 : current]}
              onChange={handleEditorChange}
              disabled={isLoading} 
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

