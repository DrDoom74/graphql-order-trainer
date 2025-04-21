
export function validateGQL(input: string) {
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
  return { valid: true, error: "" };
}

