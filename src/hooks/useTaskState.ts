
import * as React from "react";
import { tasks } from "@/data/tasks";
import { validateGQL, validateUserId } from "@/utils/graphql-validate";
import { useGraphQLQuery } from "./useGraphQLQuery";

interface TaskState {
  current: number;
  answers: string[];
  correct: boolean[];
  error?: string;
  result: unknown | null;
  isTaskInvalid: boolean;
  isLoading: boolean;
}

export function useTaskState(isSandboxMode: boolean) {
  const [state, setState] = React.useState<TaskState>({
    current: 0,
    answers: Array(tasks.length).fill(""),
    correct: Array(tasks.length).fill(false),
    result: null,
    isTaskInvalid: false,
    isLoading: false
  });

  const { executeQuery } = useGraphQLQuery();

  const task = tasks[state.current];

  const validateArguments = (query: string): { valid: boolean; error?: string } => {
    const userIdMatch = query.match(/userId\s*:\s*["']([^"']+)["']/);
    if (userIdMatch && userIdMatch[1]) {
      const userIdValidation = validateUserId(userIdMatch[1]);
      if (!userIdValidation.valid) {
        return userIdValidation;
      }
    }
    
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

  const handleRun = async () => {
    setState(prev => ({ ...prev, error: undefined, isTaskInvalid: false }));
    
    const val = state.answers[isSandboxMode ? 0 : state.current];
    const gqlCheck = validateGQL(val);
    
    if (!gqlCheck.valid) {
      setState(prev => ({ 
        ...prev, 
        result: null, 
        error: gqlCheck.error 
      }));
      return;
    }

    if (val.includes("orders(")) {
      const argsCheck = validateArguments(val);
      if (!argsCheck.valid) {
        setState(prev => ({ 
          ...prev, 
          result: null, 
          error: argsCheck.error 
        }));
        return;
      }
    }

    setState(prev => ({ ...prev, isLoading: true }));
    const result = await executeQuery(val);
    setState(prev => ({ ...prev, isLoading: false }));

    if (result.error) {
      setState(prev => ({ 
        ...prev, 
        error: result.error, 
        result: null 
      }));
      return;
    }

    setState(prev => ({ ...prev, result: result.data }));

    if (!isSandboxMode && !state.correct[state.current]) {
      if (!task.validate(val)) {
        setState(prev => ({ ...prev, isTaskInvalid: true }));
        return;
      }

      setState(prev => {
        const newCorrect = [...prev.correct];
        newCorrect[state.current] = true;
        const newAnswers = [...prev.answers];
        newAnswers[state.current] = val;
        return { ...prev, correct: newCorrect, answers: newAnswers };
      });
    }
  };

  const handleEditorChange = (text: string) => {
    setState(prev => {
      const newAnswers = [...prev.answers];
      if (isSandboxMode) {
        newAnswers[0] = text;
      } else {
        newAnswers[prev.current] = text;
      }
      return { 
        ...prev, 
        answers: newAnswers,
        error: undefined,
        isTaskInvalid: false 
      };
    });
  };

  const prev = () => {
    if (isSandboxMode) return;
    setState(prev => ({ 
      ...prev, 
      current: prev.current === 0 ? 0 : prev.current - 1 
    }));
  };

  const next = () => {
    if (isSandboxMode) return;
    setState(prev => ({ 
      ...prev, 
      current: (prev.current + 1) % tasks.length 
    }));
  };

  React.useEffect(() => {
    setState(prev => ({ 
      ...prev, 
      error: undefined, 
      result: null,
      isTaskInvalid: false 
    }));
    
    if (state.correct[state.current] && state.answers[state.current]) {
      handleRun();
    }
  }, [state.current, isSandboxMode]);

  return {
    ...state,
    task,
    handleRun,
    handleEditorChange,
    prev,
    next
  };
}

