
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
    title: "Запроси сумму (total) каждого заказа пользователя.",
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
    query: `{ orders(userId: "USER01", limit: 1) { items { name quantity price } } }`,
    validate: (input) => {
      // Проверяем, что запрашивается только первый заказ
      // Должен быть либо limit: 1, либо указан конкретный фильтр для первого заказа
      const hasLimitOne = /limit\s*:\s*1/.test(input);
      
      // Не должно быть offset параметра, так как нам нужен первый заказ
      const hasNoOffset = !/offset\s*:/.test(input);
      
      // Проверяем, что запрашиваются только поля name, quantity, price в любом порядке
      // и не запрашиваются никакие другие поля в items
      const itemsFieldPatterns = [
        /items\s*{\s*name\s+quantity\s+price\s*}/s,
        /items\s*{\s*name\s+price\s+quantity\s*}/s,
        /items\s*{\s*quantity\s+name\s+price\s*}/s,
        /items\s*{\s*quantity\s+price\s+name\s*}/s,
        /items\s*{\s*price\s+name\s+quantity\s*}/s,
        /items\s*{\s*price\s+quantity\s+name\s*}/s
      ];
      
      // Проверяем соответствие хотя бы одному из паттернов полей items
      const hasCorrectItemsFields = itemsFieldPatterns.some(pattern => pattern.test(input));
      
      // Проверяем, что в запросе нет других полей на верхнем уровне кроме items
      const hasOnlyItemsField = !/orders\s*\([^)]*\)\s*{\s*([^{]*?(id|date|status|total|delivery)[^{]*?)(?:{|$)/.test(input);
      
      // Проверяем, что нет лишних полей в items
      const hasNoExtraItemFields = !/items\s*{[^}]*(id|itemId|code|description)[^}]*}/s.test(input);
      
      return hasLimitOne && hasNoOffset && hasCorrectItemsFields && hasOnlyItemsField && hasNoExtraItemFields;
    },
    getExpectedData: (orders) => ({
      data: { orders: [{ items: orders[0].items.map(({ name, quantity, price }) => ({ name, quantity, price })) }] },
    }),
    getInvalidData: (orders) => ({
      data: { orders: [{ items: orders[0].items.map(({ name, quantity, price }) => ({ name, quantity, price })) }] },
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
      
      // Ensure no limit is specified (we want all delivered orders)
      const hasNoLimit = !/limit\s*:/s.test(input);
      
      // Check for required nested fields in delivery (in any order)
      const hasDeliveryTypeDate = /delivery\s*{[^}]*type[^}]*deliveryDate[^}]*}/s.test(input) ||
                                 /delivery\s*{[^}]*deliveryDate[^}]*type[^}]*}/s.test(input);
      
      // Check there are no unwanted fields in delivery
      const hasNoUnwantedDeliveryFields = !/delivery\s*{[^}]*(address|delivered)[^}]*}/s.test(input);

      // Check there are no fields other than delivery at the top level
      const hasOnlyDeliveryField = !/orders\s*\([^)]*\)\s*{[^{]*(id|date|status|total|items)[^{]*{/s.test(input) &&
                                  !/orders\s*\([^)]*\)\s*{[^}]*(id|date|status|total|items)[^}]*}/s.test(input);
      
      return hasDeliveredFilter && hasNoLimit && hasDeliveryTypeDate && hasNoUnwantedDeliveryFields && hasOnlyDeliveryField;
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
      // Проверяем наличие параметра limit:3 (точное значение)
      const hasLimitThree = /orders\s*\(\s*[^)]*\blimit\s*:\s*3\b[^)]*\)/s.test(input);
      
      // Должно быть поле id (обязательно)
      const hasIdField = /{\s*[^}]*\bid\b[^}]*}/s.test(input);
      
      // Допускаются поля date и status вместе с id
      const hasAllowedFields = 
        /{\s*[^}]*\bid\b[^}]*\bdate\b[^}]*\bstatus\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bid\b[^}]*\bstatus\b[^}]*\bdate\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bdate\b[^}]*\bid\b[^}]*\bstatus\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bdate\b[^}]*\bstatus\b[^}]*\bid\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bstatus\b[^}]*\bid\b[^}]*\bdate\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bstatus\b[^}]*\bdate\b[^}]*\bid\b[^}]*}/s.test(input) ||
        /{\s*[^}]*\bid\b[^}]*\bdate\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bdate\b[^}]*\bid\b[^}]*}/s.test(input) ||
        /{\s*[^}]*\bid\b[^}]*\bstatus\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bstatus\b[^}]*\bid\b[^}]*}/s.test(input) ||
        /{\s*[^}]*\bid\b[^}]*}/s.test(input);
        
      // Не должно быть вложенных объектов
      const hasNoNestedObjects = !/{\s*[^}]*(items|delivery)\s*{/s.test(input);
      
      // Проверка на отсутствие полей total, items, delivery
      const hasNoComplexFields = !/{\s*[^}]*(total|items|delivery)[^}]*}/s.test(input);
      
      return hasLimitThree && hasIdField && hasAllowedFields && hasNoNestedObjects && hasNoComplexFields;
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
    title: "Получи id, дату и статус двух заказа, начиная с третьего (id:O003).",
    query: `{ orders(userId: "USER01", offset: 2, limit: 2) { id date status } }`,
    validate: (input) => {
      // Проверяем наличие параметра limit:2
      const hasLimit2 = /orders\s*\(\s*[^)]*\blimit\s*:\s*2\b[^)]*\)/s.test(input);
      
      // Проверяем наличие параметра offset:2
      const hasOffset2 = /orders\s*\(\s*[^)]*\boffset\s*:\s*2\b[^)]*\)/s.test(input);
      
      // Проверяем наличие обязательных полей: id, date, status в любом порядке
      const hasRequiredFields = 
        /{\s*[^}]*\bid\b[^}]*\bdate\b[^}]*\bstatus\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bid\b[^}]*\bstatus\b[^}]*\bdate\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bdate\b[^}]*\bid\b[^}]*\bstatus\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bdate\b[^}]*\bstatus\b[^}]*\bid\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bstatus\b[^}]*\bid\b[^}]*\bdate\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bstatus\b[^}]*\bdate\b[^}]*\bid\b[^}]*}/s.test(input);
      
      // Проверяем отсутствие нежелательных полей
      const hasNoUnwantedFields = !/{\s*[^}]*(total|items|delivery)/s.test(input);
      
      return hasLimit2 && hasOffset2 && hasRequiredFields && hasNoUnwantedFields;
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
      // Much simpler validation logic that just checks for presence of main fields
      // Check if orders query is present with userId parameter
      const hasOrdersQuery = /orders\s*\([^)]*userId\s*:/s.test(input);
      
      // Check for required top-level fields
      const hasIdField = /\bid\b/s.test(input);
      const hasDateField = /\bdate\b/s.test(input); 
      const hasStatusField = /\bstatus\b/s.test(input);
      const hasTotalField = /\btotal\b/s.test(input);
      
      // Check for items with required fields
      const hasItemsField = /\bitems\s*{[^}]*\bname\b[^}]*\bquantity\b[^}]*\bprice\b/s.test(input) ||
                           /\bitems\s*{[^}]*\bname\b[^}]*\bprice\b[^}]*\bquantity\b/s.test(input) ||
                           /\bitems\s*{[^}]*\bquantity\b[^}]*\bname\b[^}]*\bprice\b/s.test(input) ||
                           /\bitems\s*{[^}]*\bquantity\b[^}]*\bprice\b[^}]*\bname\b/s.test(input) ||
                           /\bitems\s*{[^}]*\bprice\b[^}]*\bname\b[^}]*\bquantity\b/s.test(input) ||
                           /\bitems\s*{[^}]*\bprice\b[^}]*\bquantity\b[^}]*\bname\b/s.test(input);
      
      // Check for delivery with required fields
      const hasDeliveryField = /\bdelivery\s*{/s.test(input);
      const hasDeliveredField = /\bdelivered\b/s.test(input);
      const hasDeliveryDateField = /\bdeliveryDate\b/s.test(input);
      const hasTypeField = /\btype\b/s.test(input);
      
      // Check for address with required fields - more lenient check
      const hasAddressField = /\baddress\s*{/s.test(input);
      const hasStreetField = /\bstreet\b/s.test(input);
      const hasCityField = /\bcity\b/s.test(input);
      const hasZipField = /\bzip\b/s.test(input) || /\bzipcode\b/s.test(input) || /\bpostal\b/s.test(input);
      const hasCountryField = /\bcountry\b/s.test(input);
      
      // Ensure all main sections and fields are present
      const hasTopFields = hasIdField && hasDateField && hasStatusField && hasTotalField;
      const hasItemsStructure = hasItemsField;
      const hasDeliveryStructure = hasDeliveryField && hasDeliveredField && hasDeliveryDateField && hasTypeField;
      const hasAddressStructure = hasAddressField && hasStreetField && hasCityField && 
                                  (hasZipField || /\bpostalcode\b/s.test(input)) && hasCountryField;
      
      return hasOrdersQuery && hasTopFields && hasItemsStructure && 
             hasDeliveryStructure && hasAddressStructure;
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
    title: "Получи id и дату последнего заказ пользователя.",
    query: `{ orders(userId: "USER01", offset: 9, limit: 1) { id date } }`,
    validate: (input) => {
      // Проверяем, что запрашивается один заказ (limit: 1)
      const hasLimit1 = /orders\s*\(\s*[^)]*\blimit\s*:\s*1\b[^)]*\)/s.test(input);
      
      // Проверяем, что запрашивается с правильным смещением для последнего заказа
      const hasOffset9 = /orders\s*\(\s*[^)]*\boffset\s*:\s*9\b[^)]*\)/s.test(input);
      
      // Проверяем наличие полей id и date (в любом порядке)
      const hasIdField = /\bid\b/.test(input);
      const hasDateField = /\bdate\b/.test(input);
      
      // Допускаем также поле status
      const hasAllowedFields = 
        /{\s*[^}]*\bid\b[^}]*\bdate\b[^}]*\bstatus\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bid\b[^}]*\bstatus\b[^}]*\bdate\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bdate\b[^}]*\bid\b[^}]*\bstatus\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bdate\b[^}]*\bstatus\b[^}]*\bid\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bstatus\b[^}]*\bid\b[^}]*\bdate\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bstatus\b[^}]*\bdate\b[^}]*\bid\b[^}]*}/s.test(input) ||
        /{\s*[^}]*\bid\b[^}]*\bdate\b[^}]*}/s.test(input) || 
        /{\s*[^}]*\bdate\b[^}]*\bid\b[^}]*}/s.test(input);
      
      // Проверяем отсутствие вложенных полей
      const hasNoNestedFields = !/\bitems\s*{/.test(input) && !/\bdelivery\s*{/.test(input);
      
      // Проверяем отсутствие нежелательных полей верхнего уровня
      const hasNoExtraFields = !/{\s*[^}]*(total|items|delivery)[^}]*}/.test(input);
      
      return hasLimit1 && hasOffset9 && hasIdField && hasDateField && 
             hasAllowedFields && hasNoNestedFields && hasNoExtraFields;
    },
    getExpectedData: (orders) => ({
      data: {
        orders: [{
          id: orders[9].id,
          date: orders[9].date
        }]
      },
    }),
    getInvalidData: (orders) => ({
      data: {
        orders: [{
          id: orders[9].id,
          date: orders[9].date
        }]
      },
    }),
  },
  {
    id: 11,
    title: "Выведи все заказы пользователя, доставленные в Казахстан. Отобрази поля id, date, delivery.address.country.",
    query: `{ orders(userId: "USER01", country: "Kazakhstan") { id date delivery { address { country } } } }`,
    validate: (input) => {
      // Проверяем наличие параметра country: "Kazakhstan"
      const hasKazakhstanCountry = /orders\s*\([^)]*country\s*:\s*["']Kazakhstan["'][^)]*\)/s.test(input);
      
      // Не должно быть параметра limit
      const hasNoLimit = !/limit\s*:/s.test(input);
      
      // Проверяем наличие полей id и date на верхнем уровне
      const hasIdField = /\bid\b/s.test(input);
      const hasDateField = /\bdate\b/s.test(input);
      
      // Проверяем наличие вложенного поля country в address в delivery
      const hasNestedCountryField = /delivery\s*{\s*address\s*{\s*country\s*}\s*}/s.test(input);
      
      // Проверяем отсутствие нежелательных полей верхнего уровня
      const hasNoUnwantedTopLevelFields = !/{\s*[^}]*(status|total|items)[^}]*}/s.test(input);
      
      // Проверяем отсутствие нежелательных полей в address
      const hasNoUnwantedAddressFields = !/address\s*{\s*[^}]*(street|city|zip)[^}]*}/s.test(input);
      
      return hasKazakhstanCountry && hasNoLimit && hasIdField && hasDateField && 
             hasNestedCountryField && hasNoUnwantedTopLevelFields && hasNoUnwantedAddressFields;
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
