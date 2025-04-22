
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

interface HintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HintDialog({ open, onOpenChange }: HintDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] w-[95vw] max-w-xl p-0 sm:p-0 flex flex-col"
        style={{ overflow: "visible" }}
      >
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4">
          <DialogTitle className="flex items-center text-lg font-semibold gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" /> Подсказка
          </DialogTitle>
          <DialogDescription className="text-xs opacity-70 mt-1">
            Основы работы с GraphQL запросами
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4 text-sm">
          <div>
            <h2 className="text-lg font-semibold mb-2">Что такое GraphQL?</h2>
            <p className="text-gray-700">
              GraphQL — это язык запросов к API, позволяющий точно указать, какие данные ты хочешь получить. Вместо фиксированных REST-эндпоинтов ты строишь гибкий запрос, и сервер возвращает только нужные поля.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">📋 Синтаксис базового запроса</h2>
            <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`query {
  orders(userId: "u123") {
    id
    date
    status
  }
}`}
            </pre>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">⚙️ Аргументы запроса</h2>
            <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`orders(userId: "u123", limit: 3, offset: 1)`}
            </pre>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><code className="text-blue-600">userId</code> — обязательный аргумент</li>
              <li><code className="text-blue-600">limit</code> — ограничивает количество результатов</li>
              <li><code className="text-blue-600">offset</code> — смещает выборку (например, для пагинации)</li>
            </ul>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">🧩 Вложенные поля</h2>
            <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`{
  orders(userId: "u123") {
    delivery {
      address {
        city
        street
      }
    }
  }
}`}
            </pre>
            <p className="mt-2">
              Можно запрашивать вложенные объекты (delivery → address).
            </p>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">📦 Примеры</h2>
            <h3 className="font-semibold mt-3">🛒 Названия и цены товаров всех заказов</h3>
            <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`{
  orders(userId: "u123") {
    items {
      name
      price
    }
  }
}`}
            </pre>
            
            <h3 className="font-semibold mt-4">📍 Все адреса доставки</h3>
            <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`{
  orders(userId: "u123") {
    delivery {
      address {
        city
        street
        zip
      }
    }
  }
}`}
            </pre>
            
            <h3 className="font-semibold mt-4">🕒 Даты и статусы доставки</h3>
            <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`{
  orders(userId: "u123") {
    date
    delivery {
      delivered
    }
  }
}`}
            </pre>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">🛠 Как использовать в тренажёре</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>Скопируй любой пример из этой шпаргалки в левое окно.</li>
              <li>Нажми «Выполнить запрос» (или Ctrl+Enter).</li>
              <li>Результат появится в правом окне.</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
