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
    validate: (input) => {
      // Check for required fields
      const hasRequiredFields = /orders\s*\(.+\)\s*{[^}]*id[^}]*date[^}]*status/s.test(input) || 
                          /orders\s*\(.+\)\s*{[^}]*id[^}]*status[^}]*date/s.test(input) || 
                          /orders\s*\(.+\)\s*{[^}]*date[^}]*id[^}]*status/s.test(input) ||
                          /orders\s*\(.+\)\s*{[^}]*date[^}]*status[^}]*id/s.test(input) ||
                          /orders\s*\(.+\)\s*{[^}]*status[^}]*id[^}]*date/s.test(input) ||
                          /orders\s*\(.+\)\s*{[^}]*status[^}]*date[^}]*id/s.test(input);
      
      // Check for unwanted fields (more strict check)
      const hasUnwantedFields = /orders\s*\(.+\)\s*{[^}]*(total|items|delivery)/s.test(input);
      
      return hasRequiredFields && !hasUnwantedFields;
    },
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
    validate: (input) => {
      const hasRequiredFields = /orders\s*\(.+\)\s*{[^}]*total[^}]*}/s.test(input);
      const hasUnwantedFields = /orders\s*\(.+\)\s*{[^}]*(id|date|status|items|delivery)[^}]*}/s.test(input);
      
      return hasRequiredFields && !hasUnwantedFields;
    },
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
    validate: (input) => {
      // Check for required fields
      const hasItemsFields = /items\s*{[^}]*quantity[^}]*price[^}]*}/s.test(input) ||
                            /items\s*{[^}]*price[^}]*quantity[^}]*}/s.test(input);
      
      // Check that we're targeting the first order (no offset)
      const hasNoOffset = !/offset\s*:/s.test(input);
      
      // Check for limit:1 or not specifying limit (which would return all orders)
      const hasCorrectLimit = /limit\s*:\s*1/s.test(input) || !/limit\s*:/s.test(input);
      
      // Check there are no top-level fields other than items
      const hasOnlyItemsField = !/orders\s*\(.+\)\s*{[^{]*(id|date|status|total|delivery)[^{]*{/s.test(input);
      
      return hasItemsFields && hasNoOffset && hasCorrectLimit && hasOnlyItemsField;
    },
    getExpectedData: (orders) => ({
      data: { orders: [{ items: orders[0].items.map(({ quantity, price }) => ({ quantity, price })) }] },
    }),
    getInvalidData: (orders) => ({
      data: { orders: [{ items: orders[0].items.map(({ quantity, price }) => ({ quantity, price })) }] },
    }),
  },
  {
    id: 4,
    title: "Запроси статус доставки (delivered) всех заказов.",
    query: `{ orders(userId: "USER01") { delivery { delivered } } }`,
    validate: (input) => {
      const hasRequiredFields = /orders\s*\(.+\)\s*{[^}]*delivery\s*{[^}]*delivered[^}]*}/s.test(input);
      const hasUnwantedFields = /delivery\s*{[^}]*(type|deliveryDate|address)[^}]*}/s.test(input);
      
      return hasRequiredFields && !hasUnwantedFields;
    },
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
    validate: (input) => {
      // Check for delivered:true parameter
      const hasDeliveredFilter = /orders\s*\([^)]*delivered\s*:\s*true[^)]*\)/s.test(input);
      
      // Check for required nested fields in delivery (in any order)
      const hasDeliveryTypeDate = /delivery\s*{[^}]*type[^}]*deliveryDate[^}]*}/s.test(input) ||
                                 /delivery\s*{[^}]*deliveryDate[^}]*type[^}]*}/s.test(input);
      
      // Check there are no unwanted fields in delivery
      const hasNoUnwantedDeliveryFields = !/delivery\s*{[^}]*(address|delivered)/s.test(input);

      // Check there are no fields other than delivery at the top level
      const hasOnlyDeliveryField = !/orders\s*\([^)]*\)\s*{[^{]*(id|date|status|total|items)[^{]*{/s.test(input) &&
                                  !/orders\s*\([^)]*\)\s*{[^}]*(id|date|status|total|items)[^}]*}/s.test(input);
      
      return hasDeliveredFilter && hasDeliveryTypeDate && hasNoUnwantedDeliveryFields && hasOnlyDeliveryField;
    },
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
    query: `{ orders(userId: "USER01", offset: 1, limit: 1) { delivery { address { street city zip country } } } }`,
    validate: (input) => {
      // Check that we're targeting the second order (offset:1)
      const hasOffset = /offset\s*:\s*1/s.test(input);
      
      // Check for limit:1 to get only one order
      const hasLimit = /limit\s*:\s*1/s.test(input);
      
      // Check for required address fields in any order (must have at least these fields)
      const hasAddressFields = /address\s*{[^}]*(street|city|zip|country)[^}]*(street|city|zip|country)[^}]*(street|city|zip|country)[^}]*(street|city|zip|country)[^}]*}/s.test(input);
      
      // Check that address is within delivery
      const hasAddressWithinDelivery = /delivery\s*{[^}]*address\s*{/s.test(input);
      
      // Check there are no top-level fields besides delivery
      const hasOnlyDeliveryField = !/orders\s*\([^)]*\)\s*{[^{]*(id|date|status|total|items)[^{]*{/s.test(input) &&
                                  !/orders\s*\([^)]*\)\s*{[^}]*(id|date|status|total|items)[^}]*}/s.test(input);
      
      return hasOffset && hasLimit && hasAddressFields && hasAddressWithinDelivery && hasOnlyDeliveryField;
    },
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
    validate: (input) => {
      // Check for limit:3 parameter
      const hasLimit = /orders\s*\([^)]*limit\s*:\s*3[^)]*\)/s.test(input);
      
      // Check that we're not using offset
      const hasNoOffset = !/offset\s*:/s.test(input);
      
      return hasLimit && hasNoOffset;
    },
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
    validate: (input) => {
      // Check for limit:2 parameter
      const hasLimit = /orders\s*\([^)]*limit\s*:\s*2[^)]*\)/s.test(input);
      
      // Check for offset:2 parameter
      const hasOffset = /orders\s*\([^)]*offset\s*:\s*2[^)]*\)/s.test(input);
      
      // Check for required fields: id, date, status in any order
      const hasRequiredFields = /{\s*([^}]*id[^}]*date[^}]*status|[^}]*id[^}]*status[^}]*date|[^}]*date[^}]*id[^}]*status|[^}]*date[^}]*status[^}]*id|[^}]*status[^}]*id[^}]*date|[^}]*status[^}]*date[^}]*id)[^}]*}/s.test(input);
      
      // Check for absence of unwanted fields (более строгая проверка)
      const hasNoUnwantedFields = !/{\s*[^}]*(total|items|delivery)/s.test(input);
      
      return hasLimit && hasOffset && hasRequiredFields && hasNoUnwantedFields;
    },
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
      const hasTopFields = /orders\s*\([^)]*\)\s*{[^}]*(id)[^}]*(date)[^}]*(status)[^}]*(total)[^}]*(items)[^}]*(delivery)[^}]*}/s.test(input);
      
      // Check for required nested fields in items - less strict, allow any order
      const hasItemsFields = /items\s*{[^}]*(name)[^}]*(quantity)[^}]*(price)[^}]*}/s.test(input);
      
      // Check for required nested fields in delivery - less strict, allow any order
      const hasDeliveryFields = /delivery\s*{[^}]*(delivered)[^}]*(deliveryDate)[^}]*(type)[^}]*(address)[^}]*}/s.test(input);
      
      // Check for required nested fields in address - less strict, allow any order
      const hasAddressFields = /address\s*{[^}]*(street)[^}]*(city)[^}]*(zip)[^}]*(country)[^}]*}/s.test(input);
      
      // Ensure all requirements are met without being too strict on order or exact structure
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
    validate: (input) => {
      // Check that we're targeting the last order (offset:9)
      const hasOffset = /offset\s*:\s*9/s.test(input);
      
      // Check for limit:1 to get only one order
      const hasLimit = /limit\s*:\s*1/s.test(input);
      
      // Check for required fields in any order (must include id, date, total)
      const hasRequiredFields = /{\s*([^}]*id[^}]*date[^}]*total|[^}]*id[^}]*total[^}]*date|[^}]*date[^}]*id[^}]*total|[^}]*date[^}]*total[^}]*id|[^}]*total[^}]*id[^}]*date|[^}]*total[^}]*date[^}]*id)[^}]*}/s.test(input);
      
      // Check there are no other fields beyond the required ones
      const hasNoUnwantedFields = !/{\s*[^}]*(status|items|delivery)/s.test(input);
      
      return hasOffset && hasLimit && hasRequiredFields && hasNoUnwantedFields;
    },
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
    validate: (input) => {
      // Check for country:Kazakhstan parameter
      const hasCountry = /orders\s*\([^)]*country\s*:\s*["']Kazakhstan["'][^)]*\)/s.test(input);
      
      // Check for required fields in any order
      const hasIdAndDate = /{\s*([^}]*id[^}]*date|[^}]*date[^}]*id)[^}]*}/s.test(input);
      
      // Check for nested address.country field
      const hasCountryField = /delivery\s*{\s*address\s*{\s*country\s*}\s*}/s.test(input);
      
      return hasCountry && hasIdAndDate && hasCountryField;
    },
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
