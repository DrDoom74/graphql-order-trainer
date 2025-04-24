
export interface GraphQLResponse {
  data?: unknown;
  error?: string;
}

export function useGraphQLQuery() {
  async function executeQuery(query: string): Promise<GraphQLResponse> {
    try {
      // Чтобы избежать кеширования предыдущих ответов, добавим случайный параметр
      const cacheBuster = `?nocache=${Date.now()}`;
      
      // Убедимся, что URL правильный, в зависимости от среды и режима работы
      const baseUrl = window.location.origin.includes('localhost') || 
                      window.location.origin.includes('127.0.0.1') 
                      ? '/api/graphql' 
                      : `${window.location.origin}/api/graphql`;
      
      console.log('GraphQL request to:', `${baseUrl}${cacheBuster}`);
      
      const response = await fetch(`${baseUrl}${cacheBuster}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Добавим заголовок для предотвращения кеширования
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ query }),
      });
      
      // Проверим, что ответ успешный
      if (!response.ok) {
        console.error('GraphQL server response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText.substring(0, 200));
        
        // Специальная обработка для 404
        if (response.status === 404) {
          console.error('GraphQL endpoint not found (404)');
          return { error: `Ошибка сервера: 404. URL: ${baseUrl}. Сервер GraphQL не найден.` };
        }
        
        const errorMessage = errorText.includes('<!DOCTYPE') 
          ? 'Ошибка сервера: возвращен HTML вместо JSON. Возможно, проблема с соединением.' 
          : `Ошибка сервера: ${response.status} ${response.statusText}. ${errorText.substring(0, 100)}`;
        return { error: errorMessage };
      }
      
      // Получим сначала сырой текст, чтобы проверить, не HTML ли это
      const rawText = await response.text();
      
      // Проверим, не является ли ответ HTML
      if (rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html')) {
        console.error('Получен HTML вместо JSON:', rawText.substring(0, 200));
        return { 
          error: 'Ошибка: получен HTML вместо JSON. Возможно, проблема с соединением или сервером.' 
        };
      }
      
      // Попробуем разобрать JSON
      try {
        const data = JSON.parse(rawText);
        
        if (data.errors) {
          return { 
            error: data.errors[0]?.message || 'Произошла ошибка при выполнении запроса'
          };
        }
        
        return { data };
      } catch (jsonError: any) {
        console.error('Raw response causing parse error:', rawText.substring(0, 200) + '...');
        console.error('JSON parse error:', jsonError);
        
        return { 
          error: `Ошибка при разборе ответа: ${jsonError.message || 'Invalid JSON'}`
        };
      }
    } catch (err: any) {
      console.error('GraphQL fetch error:', err);
      
      return { 
        error: `Ошибка при выполнении запроса: ${err.message}`
      };
    }
  }

  return { executeQuery };
}
