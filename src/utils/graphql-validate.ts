import { users } from "@/data/users-mock";

export function validateGQL(input: string) {
  if (!input.trim()) {
    return { valid: false, error: "Запрос не может быть пустым" };
  }
  
  // Allow only { orders(userId...) ... } or { users ... }
  if (!input.trim().startsWith("{")) {
    return { valid: false, error: "Запрос должен начинаться с '{'" };
  }
  
  // Check if it's a users query, which is always valid
  if (input.includes("users")) {
    // Check for closing brackets
    const openBraces = (input.match(/\{/g) || []).length;
    const closeBraces = (input.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      return { valid: false, error: "Необходимо закрыть все скобки { }" };
    }
    return { valid: true, error: "" };
  }
  
  // Otherwise it must be an orders query
  if (!input.includes("orders(")) {
    return { valid: false, error: "Только запросы orders и users поддерживаются" };
  }
  if (/\bmutation\b/gi.test(input)) {
    return { valid: false, error: "Только чтение (select) разрешено" };
  }
  if (!input.includes("userId")) {
    return { valid: false, error: "userId обязателен для всех запросов orders" };
  }
  
  // Check for closing brackets
  const openBraces = (input.match(/\{/g) || []).length;
  const closeBraces = (input.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    return { valid: false, error: "Необходимо закрыть все скобки { }" };
  }
  
  return { valid: true, error: "" };
}

// New function to validate that userId exists in our mock data
export function validateUserId(userId: string) {
  // Remove quotes if present
  const cleanUserId = userId.replace(/["']/g, '');
  const userExists = users.some(user => user.id === cleanUserId);
  
  if (!userExists) {
    return { 
      valid: false, 
      error: `Пользователь с id '${cleanUserId}' не найден` 
    };
  }
  
  return { valid: true, error: "" };
}
