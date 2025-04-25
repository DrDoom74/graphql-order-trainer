
import * as React from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
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
            <HelpCircle className="w-5 h-5 text-blue-500" /> 💡 Подсказка по GraphQL
          </DialogTitle>
          <DialogDescription className="text-xs opacity-70 mt-1">
            Краткая справка по работе с API заказов
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4 text-sm">
          <p>В этом тренажёре вы работаете с API заказов. Вот краткая справка по структуре, синтаксису и возможностям запросов.</p>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">🧱 Базовая структура запроса</h2>
            <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`{
  orders(userId: "u123") {
    id
    date
    status
  }
}`}
            </pre>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><code className="text-blue-600">orders</code> — корневой запрос (возвращает список заказов)</li>
              <li><code className="text-blue-600">userId</code> — обязательный параметр, без него вы ничего не получите</li>
              <li>внутри <code className="text-blue-600">orders {"{"} ... {"}"}</code> вы указываете, какие поля хотите получить</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">🧩 Какие поля можно запрашивать у заказа?</h2>
            <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`orders {
  id            # ID заказа
  date          # Дата заказа
  status        # Статус: Delivered, Pending
  total         # Общая сумма
  items {       # Товары в заказе
    name
    quantity
    price
  }
  delivery {    # Доставка
    delivered         # Был ли заказ доставлен (true/false)
    deliveryDate      # Дата доставки
    type              # Тип доставки (express, standard)
    address {         # Адрес доставки
      country
      city
      street
    }
  }
}`}
            </pre>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">⚙️ Доступные параметры у <code>orders</code></h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Параметр</th>
                  <th className="border p-2 text-left">Тип</th>
                  <th className="border p-2 text-left">Обязательный</th>
                  <th className="border p-2 text-left">Описание</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>userId</code></td>
                  <td className="border p-2">String</td>
                  <td className="border p-2">✅ да</td>
                  <td className="border p-2">ID пользователя (например: "u123")</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>offset</code></td>
                  <td className="border p-2">Int</td>
                  <td className="border p-2">❌ нет</td>
                  <td className="border p-2">Пропустить N заказов (например, <code>offset: 2</code>)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>limit</code></td>
                  <td className="border p-2">Int</td>
                  <td className="border p-2">❌ нет</td>
                  <td className="border p-2">Ограничить количество заказов (например, 3)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>delivered</code></td>
                  <td className="border p-2">Boolean</td>
                  <td className="border p-2">❌ нет</td>
                  <td className="border p-2">Вернуть только доставленные или нет</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>country</code></td>
                  <td className="border p-2">String</td>
                  <td className="border p-2">❌ нет</td>
                  <td className="border p-2">Фильтрация по стране доставки (например, "Kazakhstan")</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-2">
              <p>🟡 Параметры <code>offset</code>, <code>limit</code>, <code>delivered</code>, <code>country</code> — опциональны, но <strong>работают только с `orders`</strong></p>
              <p>🟢 Вы можете использовать их <strong>вместе</strong>, например:</p>
              <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto mt-2">
{`{
  orders(userId: "u123", delivered: true, country: "Kazakhstan", limit: 1) {
    id
    date
  }
}`}
              </pre>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">📘 Дополнительные советы</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Порядок полей в GraphQL не важен</li>
              <li>Все поля <strong>вложенные</strong> — вы явно указываете, что хотите от них (например: <code>items {"{"} name {"}"}</code>)</li>
              <li>Если вы сделаете опечатку в названии поля — API вернёт ошибку</li>
              <li>Если вы запросите несуществующий <code>userId</code>, данные будут пустыми</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">🔍 Примеры</h2>
            <div>
              <h3 className="font-semibold mt-3">Только доставленные заказы с типом и датой:</h3>
              <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`{
  orders(userId: "u123", delivered: true) {
    delivery {
      type
      deliveryDate
    }
  }
}`}
              </pre>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mt-3">Фильтрация по стране:</h3>
              <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
{`{
  orders(userId: "u123", country: "Kazakhstan") {
    id
    delivery {
      address {
        country
      }
    }
  }
}`}
              </pre>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-700">💬 Хотите потренироваться без ограничений? Включите режим <strong>Песочницы</strong> и пишите любые запросы!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
