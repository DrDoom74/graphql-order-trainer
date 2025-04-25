
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
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*id[^}]*date[^}]*status/s.test(input) || 
                        /orders\s*\(.+\)\s*{[^}]*id[^}]*status[^}]*date/s.test(input) || 
                        /orders\s*\(.+\)\s*{[^}]*date[^}]*id[^}]*status/s.test(input) ||
                        /orders\s*\(.+\)\s*{[^}]*date[^}]*status[^}]*id/s.test(input) ||
                        /orders\s*\(.+\)\s*{[^}]*status[^}]*id[^}]*date/s.test(input) ||
                        /orders\s*\(.+\)\s*{[^}]*status[^}]*date[^}]*id/s.test(input),
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
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*items\s*{[^}]*quantity[^}]*price[^}]*}/s.test(input) ||
                        /orders\s*\(.+\)\s*{[^}]*items\s*{[^}]*price[^}]*quantity[^}]*}/s.test(input),
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
    title: "Покажи тип доставки и дату для доставленных заказов (используй фильтр delivered).",
    query: `{ orders(userId: "USER01", delivered: true) { delivery { type deliveryDate } } }`,
    validate: (input) => /orders\s*\(.+delivered\s*:\s*true.+\)\s*{[^}]*delivery\s*{[^}]*type[^}]*deliveryDate[^}]*}/s.test(input) ||
                         /orders\s*\(.+delivered\s*:\s*true.+\)\s*{[^}]*delivery\s*{[^}]*deliveryDate[^}]*type[^}]*}/s.test(input),
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
    validate: (input) => /orders\s*\(.+\)\s*{[^}]*delivery\s*{[^}]*address\s*{[^}]*street[^}]*city[^}]*zip[^}]*country[^}]*}/s.test(input) ||
                         /orders\s*\(.+\)\s*{[^}]*delivery\s*{[^}]*address\s*{.*street.*city.*zip.*country.*}/s.test(input),
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
    title: "Получи 2 заказа, начиная с третьего.",
    query: `{ orders(userId: "USER01", limit: 2, offset: 2) { id date status } }`,
    validate: (input) => /orders\s*\(.+limit\s*:\s*2.*offset\s*:\s*2[^)]*\)\s*{.*id.*date.*status.*}/s.test(input),
    getExpectedData: (orders) => ({
      data: { 
        orders: orders.slice(2, 4).map((o) => ({ 
          id: o.id,
          date: o.date,
          status: o.status 
        }))
      },
    }),
    getInvalidData: (orders) => ({
      data: { 
        orders: orders.slice(2, 4).map((o) => ({ 
          id: o.id,
          date: o.date,
          status: o.status 
        }))
      },
    }),
  },
  {
    id: 9,
    title: "Покажи все поля заказа, включая товары и доставку.",
    query: `{ orders(userId: "USER01") { id date status total items { name quantity price } delivery { delivered deliveryDate type address { street city zip country } } } }`,
    validate: (input) => {
      // Check for required top-level fields
      const hasTopFields = /orders\s*\(.+\)\s*{.*id.*date.*status.*total.*items.*delivery.*}/s.test(input);
      // Check for required nested fields in items
      const hasItemsFields = /items\s*{.*name.*quantity.*price.*}/s.test(input);
      // Check for required nested fields in delivery
      const hasDeliveryFields = /delivery\s*{.*delivered.*deliveryDate.*type.*address.*}/s.test(input);
      // Check for required nested fields in address
      const hasAddressFields = /address\s*{.*street.*city.*zip.*country.*}/s.test(input);
      
      return hasTopFields && hasItemsFields && hasDeliveryFields && hasAddressFields;
    },
    getExpectedData: (orders) => ({
      data: { orders },
    }),
    getInvalidData: (orders) => ({
      data: { orders },
    }),
  },
  {
    id: 10,
    title: "Получи последний заказ пользователя",
    query: `{ orders(userId: "USER01", offset: 9, limit: 1) { id date total } }`,
    validate: (input) => /orders\s*\(.+offset\s*:\s*9.*limit\s*:\s*1[^}]*id[^}]*date[^}]*total/s.test(input),
    getExpectedData: (orders) => ({
      data: {
        orders: [{
          id: orders[9].id,
          date: orders[9].date,
          total: orders[9].total
        }]
      },
    }),
    getInvalidData: (orders) => ({
      data: {
        orders: [{
          id: orders[9].id,
          date: orders[9].date,
          total: orders[9].total
        }]
      },
    }),
  },
  {
    id: 11,
    title: "Выведи все заказы пользователя, доставленные в Казахстан. Отобрази поля id, date, delivery.address.country.",
    query: `{ orders(userId: "USER01", country: "Kazakhstan") { id date delivery { address { country } } } }`,
    validate: (input) => /orders\s*\(.+country\s*:\s*"Kazakhstan"[^)]*\)\s*{.*id.*date.*delivery\s*{.*address\s*{.*country.*}.*}.*}/s.test(input),
    getExpectedData: (orders) => ({
      data: {
        orders: orders
          .filter(o => o.delivery.address.country === "Kazakhstan")
          .map(o => ({
            id: o.id,
            date: o.date,
            delivery: {
              address: {
                country: o.delivery.address.country
              }
            }
          }))
      },
    }),
    getInvalidData: (orders) => ({
      data: {
        orders: orders
          .filter(o => o.delivery.address.country === "Kazakhstan")
          .map(o => ({
            id: o.id,
            date: o.date,
            delivery: {
              address: {
                country: o.delivery.address.country
              }
            }
          }))
      },
    }),
  }
];
