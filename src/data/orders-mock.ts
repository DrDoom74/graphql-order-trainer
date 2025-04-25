
export const orders = [
  {
    id: "O001",
    date: "2025-01-10",
    status: "Delivered",
    total: 113.99,
    items: [
      { name: "Лейка садовая", quantity: 2, price: 10.91 },
      { name: "Карандаш грифельный", quantity: 1, price: 49.13 },
      { name: "Бумага офисная", quantity: 1, price: 76.12 },
    ],
    delivery: {
      delivered: true,
      deliveryDate: "2025-01-13",
      type: "Courier",
      address: {
        street: "пер. Сурикова, д. 107",
        city: "п. Ставрополь",
        zip: "954959",
        country: "Russia",
      },
    },
  },
  {
    id: "O002",
    date: "2025-01-11",
    status: "Delivered",
    total: 53.92,
    items: [
      { name: "Кружка чайная", quantity: 1, price: 13.77 },
      { name: "Стул складной", quantity: 1, price: 65.29 },
      { name: "Лампа настольная", quantity: 2, price: 28.69 },
    ],
    delivery: {
      delivered: true,
      deliveryDate: "2025-01-14",
      type: "Courier",
      address: {
        street: "алл. Сельская, д. 48",
        city: "г. Октябрьское (Хант.)",
        zip: "927682",
        country: "Russia",
      },
    },
  },
  {
    id: "O003",
    date: "2025-01-12",
    status: "Pending",
    total: 166.35,
    items: [{ name: "Фоторамка деревянная", quantity: 3, price: 59.65 }],
    delivery: {
      delivered: false,
      deliveryDate: null,
      type: "Courier",
      address: {
        street: "ул. Абая, д. 45",
        city: "Алматы",
        zip: "050000",
        country: "Kazakhstan",
      },
    },
  },
  {
    id: "O004",
    date: "2025-01-13",
    status: "Pending",
    total: 149.44,
    items: [
      { name: "Подушка декоративная", quantity: 1, price: 30.31 },
      { name: "Набор посуды", quantity: 1, price: 62.79 },
    ],
    delivery: {
      delivered: false,
      deliveryDate: null,
      type: "Courier",
      address: {
        street: "пер. Луначарского, д. 4",
        city: "с. Белогорск (Амур.)",
        zip: "785170",
        country: "Russia",
      },
    },
  },
  {
    id: "O005",
    date: "2025-01-14",
    status: "Delivered",
    total: 87.96,
    items: [
      { name: "Полотенце банное", quantity: 3, price: 51.48 },
      { name: "Зеркало настенное", quantity: 3, price: 83.21 },
      { name: "Часы настенные", quantity: 3, price: 56.33 },
    ],
    delivery: {
      delivered: true,
      deliveryDate: "2025-01-17",
      type: "Courier",
      address: {
        street: "бул. Подгорный, д. 9/4",
        city: "с. Тырныауз",
        zip: "918965",
        country: "Russia",
      },
    },
  },
  {
    id: "O006",
    date: "2025-01-15",
    status: "Pending",
    total: 74.47,
    items: [
      { name: "Чайник электрический", quantity: 3, price: 15.66 },
      { name: "Ваза стеклянная", quantity: 1, price: 91.25 },
      { name: "Фен для волос", quantity: 2, price: 86.73 },
    ],
    delivery: {
      delivered: false,
      deliveryDate: null,
      type: "Pickup Point",
      address: {
        street: "пр. Достык, д. 136",
        city: "Нур-Султан",
        zip: "010000",
        country: "Kazakhstan",
      },
    },
  },
  {
    id: "O007",
    date: "2025-01-16",
    status: "Pending",
    total: 149.36,
    items: [
      { name: "Скатерть льняная", quantity: 1, price: 64.77 },
      { name: "Коврик для йоги", quantity: 1, price: 26.81 },
    ],
    delivery: {
      delivered: false,
      deliveryDate: null,
      type: "Pickup Point",
      address: {
        street: "ш. Севастопольское, д. 6/4 стр. 1",
        city: "д. Великий Устюг",
        zip: "076114",
        country: "Russia",
      },
    },
  },
  {
    id: "O008",
    date: "2025-01-17",
    status: "Delivered",
    total: 127.68,
    items: [
      { name: "Книга кулинарная", quantity: 1, price: 78.27 },
      { name: "Планшет графический", quantity: 3, price: 43.09 },
    ],
    delivery: {
      delivered: true,
      deliveryDate: "2025-01-20",
      type: "Pickup Point",
      address: {
        street: "пр. Юности, д. 41 к. 41",
        city: "к. Урюпинск",
        zip: "605536",
        country: "Russia",
      },
    },
  },
  {
    id: "O009",
    date: "2025-01-18",
    status: "Pending",
    total: 61.74,
    items: [
      { name: "Набор красок", quantity: 2, price: 88.98 },
      { name: "Мышь компьютерная", quantity: 2, price: 51.23 },
    ],
    delivery: {
      delivered: false,
      deliveryDate: null,
      type: "Courier",
      address: {
        street: "ул. Тауелсиздик, д. 54",
        city: "Шымкент",
        zip: "160000",
        country: "Kazakhstan",
      },
    },
  },
  {
    id: "O010",
    date: "2025-01-19",
    status: "Pending",
    total: 190.2,
    items: [
      { name: "Наушники беспроводные", quantity: 1, price: 94.62 },
      { name: "Клавиатура механическая", quantity: 1, price: 72.88 },
    ],
    delivery: {
      delivered: false,
      deliveryDate: null,
      type: "Courier",
      address: {
        street: "ш. Цветочное, д. 84 к. 1",
        city: "к. Орел",
        zip: "771295",
        country: "Russia",
      },
    },
  },
];
