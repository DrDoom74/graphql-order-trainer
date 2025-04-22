
import * as React from "react";
import { Check } from "lucide-react";

interface Props {
  result: unknown;
  error?: string;
  isTaskComplete?: boolean;
  isTaskInvalid?: boolean;
}

export default function GraphQLResult({ result, error, isTaskComplete, isTaskInvalid }: Props) {
  return (
    <div className="w-full h-full">
      <div className="rounded-lg border border-gray-300 bg-white p-4 min-h-[120px] font-mono text-base overflow-x-auto text-left animate-fade-in">
        {isTaskComplete && (
          <div className="mb-3 bg-green-100 text-green-800 p-2 rounded-md flex items-center gap-2 animate-scale-in">
            <Check className="h-5 w-5 text-green-600" />
            <span className="font-medium">Успешно! Задание выполнено.</span>
          </div>
        )}
        
        {isTaskInvalid && (
          <div className="mb-3 bg-yellow-100 text-yellow-800 p-2 rounded-md animate-fade-in">
            <span className="font-medium">Ответ не соответствует заданию. Попробуйте ещё раз.</span>
          </div>
        )}
        
        {error && (
          <div className="mb-2 text-red-600 font-semibold animate-fade-in">
            <div className="bg-red-50 p-2 rounded-md mb-2">
              Ошибка в запросе. Проверьте синтаксис или названия полей.
            </div>
            <div className="text-sm text-red-800 bg-red-50 p-2 rounded-md font-normal">
              {error}
            </div>
          </div>
        )}
        
        {!error && result && (
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
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
