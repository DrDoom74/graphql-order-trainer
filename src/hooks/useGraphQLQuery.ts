
export interface GraphQLResponse {
  data?: unknown;
  error?: string;
}

export function useGraphQLQuery() {
  async function executeQuery(query: string): Promise<GraphQLResponse> {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        const errorMessage = errorText.includes('<!DOCTYPE') 
          ? 'Ошибка сервера: возвращен HTML вместо JSON. Возможно, проблема с соединением.' 
          : `Ошибка сервера: ${response.status} ${response.statusText}. ${errorText.substring(0, 100)}`;
        return { error: errorMessage };
      }
      
      // Get raw text first to check if it's not HTML
      const rawText = await response.text();
      
      // Check if the response starts with HTML
      if (rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html')) {
        return { 
          error: 'Ошибка: получен HTML вместо JSON. Возможно, проблема с соединением или сервером.' 
        };
      }
      
      // Try to parse the JSON response from text
      try {
        const data = JSON.parse(rawText);
        
        if (data.errors) {
          return { 
            error: data.errors[0]?.message || 'Произошла ошибка при выполнении запроса'
          };
        }
        
        return { data };
      } catch (jsonError) {
        console.error('Raw response causing parse error:', rawText.substring(0, 200) + '...');
        return { 
          error: `Ошибка при разборе ответа: ${jsonError.message || 'Invalid JSON'}`
        };
      }
    } catch (err: any) {
      return { 
        error: `Ошибка при выполнении запроса: ${err.message}`
      };
    }
  }

  return { executeQuery };
}

