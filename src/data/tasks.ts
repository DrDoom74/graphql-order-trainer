
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
      // Check for limit:1 or set specific limit parameter to only get the first order
      const hasLimitOne = /limit\s*:\s*1/s.test(input);
      
      // Alternative: check if the query doesn't specify an offset (which would get the first order by default)
      const hasNoOffset = !/offset\s*:/s.test(input);
      
      // Check for items fields in any order (must be exactly these 3 fields)
      const itemsFieldPattern = /items\s*{[^}]*name[^}]*quantity[^}]*price[^}]*}|items\s*{[^}]*name[^}]*price[^}]*quantity[^}]*}|items\s*{[^}]*quantity[^}]*name[^}]*price[^}]*}|items\s*{[^}]*quantity[^}]*price[^}]*name[^}]*}|items\s*{[^}]*price[^}]*name[^}]*quantity[^}]*}|items\s*{[^}]*price[^}]*quantity[^}]*name[^}]*}/s;
      const hasCorrectItemsFields = itemsFieldPattern.test(input);
      
      // Make sure there are only items fields at the top level (no id, date, status, etc.)
      const hasOnlyItemsAtTopLevel = !/orders\s*\([^)]*\)\s*{[^{]*(id|date|status|total|delivery)[^{]*{/s.test(input) &&
                                   !/orders\s*\([^)]*\)\s*{[^}]*(id|date|status|total|delivery)[^}]*}/s.test(input);
      
      // Ensure items fields has exactly the required fields (no extras like item id)
      const hasExactlyRequiredItemsFields = !(/items\s*{[^}]*(id|itemId|code|description)[^}]*}/s.test(input));
      
      // We want either limit:1 or no specification of limit, ensuring we get just the first order
      const limitIsCorrect = hasLimitOne || (!/limit\s*:/s.test(input));
      
      return hasNoOffset && limitIsCorrect && hasCorrectItemsFields && hasOnlyItemsAtTopLevel && hasExactlyRequiredItemsFields;
    },
    getExpectedData: (orders) => ({
      data: { orders: [{ items: orders[0].items.map(({ quantity, price, name }) => ({ quantity, price, name })) }] },
    }),
    getInvalidData: (orders) => ({
      data: { orders: [{ items: orders[0].items.map(({ quantity, price, name }) => ({ quantity, price, name })) }] },
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
      // Check for limit:3 parameter
      const hasLimit3 = /orders\s*\([^)]*limit\s*:\s*3[^)]*\)/s.test(input);
      
      // Check that we're not using offset
      const hasNoOffset = !/offset\s*:/s.test(input);
      
      // Must have at least the id field, but can allow other basic fields like date, status
      const hasIdField = /{\s*[^}]*id[^}]*}/s.test(input);
      
      // Should not have nested objects like items or delivery
      const hasNoNestedObjects = !/{\s*[^}]*(items|delivery)[^}]*{/s.test(input);
      
      return hasLimit3 && hasNoOffset && hasIdField && hasNoNestedObjects;
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
      
      // Check for absence of unwanted fields
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
    title: "Получи последний заказ пользователя",
    query: `{ orders(userId: "USER01", offset: 9, limit: 1) { id date total } }`,
    validate: (input) => {
      // Check for limit:1 (required to get only the last order)
      const hasLimit1 = /limit\s*:\s*1/s.test(input);
      
      // Check for offset that would return the last order (offset: 9 for a 10-item array)
      const hasOffset9 = /offset\s*:\s*9/s.test(input);
      
      // Check for required fields: id and date (in any order)
      const hasIdField = /\bid\b/s.test(input);
      const hasDateField = /\bdate\b/s.test(input);
      
      // Ensure total field is optional but allowed
      const hasNoUnwantedFields = !/{\s*[^}]*(status|items|delivery)/s.test(input);
      
      // Check that no nested fields like items or delivery are requested
      const noNestedFields = !/\bitems\s*{/s.test(input) && !/\bdelivery\s*{/s.test(input);
      
      return hasLimit1 && hasOffset9 && hasIdField && hasDateField && hasNoUnwantedFields && noNestedFields;
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
      
      // Ensure no limit parameter is specified (we want all Kazakhstan orders)
      const hasNoLimit = !/limit\s*:/s.test(input);
      
      // Check for required top-level fields (id and date in any order)
      const hasIdField = /\bid\b/s.test(input);
      const hasDateField = /\bdate\b/s.test(input);
      
      // Check for nested country field within address within delivery
      const hasNestedCountryField = /delivery\s*{\s*address\s*{\s*country\s*}\s*}/s.test(input);
      
      // Check that there are no unwanted fields at top level
      const hasNoUnwantedTopLevelFields = !/{\s*[^}]*(status|total|items)[^}]*}/s.test(input);
      
      // Check that there are no unwanted fields in address
      const hasNoUnwantedAddressFields = !/address\s*{\s*[^}]*(street|city|zip)[^}]*}/s.test(input);
      
      return hasCountry && hasNoLimit && hasIdField && hasDateField && hasNestedCountryField && 
             hasNoUnwantedTopLevelFields && hasNoUnwantedAddressFields;
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
