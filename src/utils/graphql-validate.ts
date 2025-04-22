
export function validateGQL(input: string) {
  if (!input.trim()) {
    return { valid: false, error: "Запрос не может быть пустым" };
  }
  
  // Разрешаем только { orders(userId...) ... }
  if (!input.trim().startsWith("{")) {
    return { valid: false, error: "Запрос должен начинаться с '{'" };
  }
  if (!input.includes("orders(")) {
    return { valid: false, error: "Только запросы orders поддерживаются" };
  }
  if (/\bmutation\b/gi.test(input)) {
    return { valid: false, error: "Только чтение (select) разрешено" };
  }
  if (!input.includes("userId")) {
    return { valid: false, error: "userId обязателен для всех запросов" };
  }
  
  // Проверка на закрывающие скобки
  const openBraces = (input.match(/\{/g) || []).length;
  const closeBraces = (input.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    return { valid: false, error: "Необходимо закрыть все скобки { }" };
  }
  
  return { valid: true, error: "" };
}
