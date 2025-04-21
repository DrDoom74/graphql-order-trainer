
import * as React from "react";

interface Props {
  result: unknown;
  error?: string;
}

export default function GraphQLResult({ result, error }: Props) {
  return (
    <div className="w-full h-full">
      <div className="rounded-lg border border-gray-300 bg-white p-4 min-h-[120px] font-mono text-base overflow-x-auto text-left animate-fade-in">
        {error && (
          <div className="mb-2 text-red-600 font-semibold animate-fade-in">
            {error}
          </div>
        )}
        {!error && (
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
