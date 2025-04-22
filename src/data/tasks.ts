export interface Task {
  id: number
  title: string
  query: string // эталонный запрос (для минимальной проверки)
  validate: (input: string) => boolean // функция проверки (можно упростить)
  getExpectedData: (orders: any[]) => any // функция выдачи mock-вывода
  getInvalidData: (orders: any[]) => any // функция выдачи mock-вывода
}

export const tasks: Task[] = [
  {
    id: 1,
    title: "Получи список заказов пользователя с ID, датой и статусом заказа.",
    query: `{ orders(userId: "USER01") { id date status } }`,
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*id[^}]*date[^}]*status/s.test(input),
    getExpectedData: (orders) => ({
      data: {
        orders: orders.map((o) => ({
          id: o.id,
          date: o.date,
          status: o.status,
        })),
      },
    }),
    getInvalidData: (orders) => ({
      data: {
        orders: orders.map((o) => ({
          id: o.id,
          date: o.date,
          status: o.status,
        })),
      },
    }),
  },
  {
    id: 2,
    title: "Запроси сумму (total) каждого заказа.",
    query: `{ orders(userId: "USER01") { total } }`,
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*total/s.test(input),
    getExpectedData: (orders) => ({
      data: { orders: orders.map((o) => ({ total: o.total })) },
    }),
    getInvalidData: (orders) => ({
      data: { orders: orders.map((o) => ({ total: o.total })) },
    }),
  },
  {
    id: 3,
    title: "Выведи список товаров (items) первого заказа с количеством и ценой.",
    query: `{ orders(userId: "USER01") { items { quantity price } } }`,
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*items\s*{[^}]*quantity[^}]*price[^}]*}/s.test(input),
    getExpectedData: (orders) => ({
      data: { orders: [orders[0].items.map(({ quantity, price }) => ({ quantity, price }))] },
    }),
    getInvalidData: (orders) => ({
      data: { orders: [orders[0].items.map(({ quantity, price }) => ({ quantity, price }))] },
    }),
  },
  {
    id: 4,
    title: "Запроси статус доставки (delivered) всех заказов.",
    query: `{ orders(userId: "USER01") { delivery { delivered } } }`,
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*delivery\s*{[^}]*delivered[^}]*}/s.test(input),
    getExpectedData: (orders) => ({
      data: { orders: orders.map((o) => ({ delivery: { delivered: o.delivery.delivered } })) },
    }),
    getInvalidData: (orders) => ({
      data: { orders: orders.map((o) => ({ delivery: { delivered: o.delivery.delivered } })) },
    }),
  },
  {
    id: 5,
    title: "Покажи тип доставки и дату, если доставка была завершена.",
    query: `{ orders(userId: "USER01") { delivery { type deliveryDate } } }`,
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*delivery\s*{[^}]*type[^}]*deliveryDate[^}]*}/s.test(input),
    getExpectedData: (orders) => ({
      data: {
        orders: orders
          .filter((o) => o.delivery.delivered)
          .map((o) => ({
            delivery: {
              type: o.delivery.type,
              deliveryDate: o.delivery.deliveryDate,
            },
          })),
      },
    }),
    getInvalidData: (orders) => ({
      data: {
        orders: orders
          .filter((o) => o.delivery.delivered)
          .map((o) => ({
            delivery: {
              type: o.delivery.type,
              deliveryDate: o.delivery.deliveryDate,
            },
          })),
      },
    }),
  },
  {
    id: 6,
    title: "Получи адрес доставки для второго заказа.",
    query: `{ orders(userId: "USER01") { delivery { address { street city zip country } } } }`,
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*delivery\s*{[^}]*address\s*{[^}]*street[^}]*city[^}]*zip[^}]*country[^}]*}/s.test(input),
    getExpectedData: (orders) => ({
      data: {
        orders: [
          {
            delivery: {
              address: { ...orders[1]?.delivery?.address },
            },
          },
        ],
      },
    }),
    getInvalidData: (orders) => ({
      data: {
        orders: [
          {
            delivery: {
              address: { ...orders[1]?.delivery?.address },
            },
          },
        ],
      },
    }),
  },
  {
    id: 7,
    title: "Выведи только первые 3 заказа с помощью limit.",
    query: `{ orders(userId: "USER01", limit: 3) { id } }`,
    validate: (input) => /orders\s*\(.+limit\s*:\s*3[^)]*\)/s.test(input),
    getExpectedData: (orders) => ({
      data: { orders: orders.slice(0, 3).map((o) => ({ id: o.id })) },
    }),
    getInvalidData: (orders) => ({
      data: { orders: orders.slice(0, 3).map((o) => ({ id: o.id })) },
    }),
  },
  {
    id: 8,
    title: "По��учи 2 заказа, начиная с третьего (offset = 2, limit = 2).",
    query: `{ orders(userId: "USER01", limit: 2, offset: 2) { id } }`,
    validate: (input) => /orders\s*\(.+limit\s*:\s*2.*offset\s*:\s*2[^)]*\)/s.test(input),
    getExpectedData: (orders) => ({
      data: { orders: orders.slice(2, 4).map((o) => ({ id: o.id })) },
    }),
    getInvalidData: (orders) => ({
      data: { orders: orders.slice(2, 4).map((o) => ({ id: o.id })) },
    }),
  },
  {
    id: 9,
    title: "Покажи все поля заказа, включая товары и доставку.",
    query: `{ orders(userId: "USER01") { id date status total items { name quantity price } delivery { delivered deliveryDate type address { street city zip country } } } }`,
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*id[^}]*date[^}]*status[^}]*total[^}]*items\s*{[^}]*name[^}]*quantity[^}]*price[^}]*}[^}]*delivery\s*{[^}]*delivered[^}]*deliveryDate[^}]*type[^}]*address\s*{[^}]*street[^}]*city[^}]*zip[^}]*country[^}]*}[^}]*}/s.test(input),
    getExpectedData: (orders) => ({
      data: { orders },
    }),
    getInvalidData: (orders) => ({
      data: { orders },
    }),
  },
  {
    id: 10,
    title: "Сравни доставленные и недоставленные заказы вручную по полю delivered.",
    query: `{ orders(userId: "USER01") { id delivery { delivered } } }`,
    validate: (input) =>
      /orders\s*\(.+\)\s*{[^}]*id[^}]*delivery\s*{[^}]*delivered[^}]*}/s.test(input),
    getExpectedData: (orders) => ({
      data: {
        orders: orders.map((o) => ({
          id: o.id,
          delivery: { delivered: o.delivery.delivered },
        })),
      },
    }),
    getInvalidData: (orders) => ({
      data: {
        orders: orders.map((o) => ({
          id: o.id,
          delivery: { delivered: o.delivery.delivered },
        })),
      },
    }),
  },
];
