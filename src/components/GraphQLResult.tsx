
import * as React from "react";
import { Check } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  result: unknown;
  error?: string;
  isTaskComplete?: boolean;
  isTaskInvalid?: boolean;
}

export default function GraphQLResult({ result, error, isTaskComplete, isTaskInvalid }: Props) {
  const preRef = React.useRef<HTMLPreElement>(null);

  React.useEffect(() => {
    if (preRef.current && result) {
      preRef.current.textContent = JSON.stringify(result, null, 2);
      Prism.highlightElement(preRef.current);
    }
  }, [result]);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {isTaskComplete && (
        <div className="bg-green-100 text-green-800 p-2 rounded-md flex items-center gap-2 animate-scale-in">
          <Check className="h-5 w-5 text-green-600" />
          <span className="font-medium">Успешно! Задание выполнено.</span>
        </div>
      )}
      
      {isTaskInvalid && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded-md animate-fade-in">
          <span className="font-medium">Ответ не соответствует заданию. Попробуйте ещё раз.</span>
        </div>
      )}
      
      {error && (
        <div className="text-red-600 font-semibold animate-fade-in">
          <div className="bg-red-50 p-2 rounded-md mb-2">
            Ошибка в запросе. Проверьте синтаксис или названия полей.
          </div>
          <div className="text-sm text-red-800 bg-red-50 p-2 rounded-md font-normal whitespace-pre-wrap break-all">
            {error}
          </div>
          
          {error.includes('404') && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>
                Проблема с подключением к GraphQL серверу. Пожалуйста, проверьте, что сервер запущен и доступен по адресу <code>/api/graphql</code>.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      <div className="rounded-lg border border-gray-200 bg-white p-4 min-h-[240px] overflow-x-auto text-left">
        {!error && result && (
          <pre ref={preRef} className="language-json whitespace-pre-wrap" />
        )}
        
        {!error && !result && !isTaskComplete && !isTaskInvalid && (
          <div className="text-gray-500 italic">
            Запустите запрос, чтобы увидеть результат.
          </div>
        )}
      </div>
    </div>
  );
}
