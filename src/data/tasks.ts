export interface Task {
  id: number
  title: string
  validate: (query: string) => boolean
}

export const tasks: Task[] = [
  {
    id: 1,
    title: "Список пользователей",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseQuery.includes("query") && lowerCaseQuery.includes("users");
    }
  },
  {
    id: 2,
    title: "Только ID и имена пользователей",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        lowerCaseQuery.includes("query") &&
        lowerCaseQuery.includes("users") &&
        lowerCaseQuery.includes("id") &&
        lowerCaseQuery.includes("name") &&
        !lowerCaseQuery.includes("email")
      );
    }
  },
  {
    id: 3,
    title: "Заказы конкретного пользователя",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        lowerCaseQuery.includes("query") &&
        lowerCaseQuery.includes("orders") &&
        lowerCaseQuery.includes("userid")
      );
    }
  },
  {
    id: 4,
    title: "ID, дата и статус заказов",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        lowerCaseQuery.includes("query") &&
        lowerCaseQuery.includes("orders") &&
        lowerCaseQuery.includes("id") &&
        lowerCaseQuery.includes("date") &&
        lowerCaseQuery.includes("status") &&
        !lowerCaseQuery.includes("total") &&
        !lowerCaseQuery.includes("items") &&
        !lowerCaseQuery.includes("delivery")
      );
    }
  },
  {
    id: 5,
    title: "Заказы с лимитом в 5",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        lowerCaseQuery.includes("query") &&
        lowerCaseQuery.includes("orders") &&
        lowerCaseQuery.includes("limit: 5")
      );
    }
  },
  {
    id: 6,
    title: "Заказы с ID, датой, статусом и лимитом в 3",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        lowerCaseQuery.includes("query") &&
        lowerCaseQuery.includes("orders") &&
        lowerCaseQuery.includes("id") &&
        lowerCaseQuery.includes("date") &&
        lowerCaseQuery.includes("status") &&
        lowerCaseQuery.includes("limit: 3") &&
        !lowerCaseQuery.includes("total") &&
        !lowerCaseQuery.includes("items") &&
        !lowerCaseQuery.includes("delivery")
      );
    }
  },
  {
    id: 7,
    title: "Заказы с ID, датой, статусом, доставкой и лимитом в 4",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        lowerCaseQuery.includes("query") &&
        lowerCaseQuery.includes("orders") &&
        lowerCaseQuery.includes("id") &&
        lowerCaseQuery.includes("date") &&
        lowerCaseQuery.includes("status") &&
        lowerCaseQuery.includes("delivery") &&
        lowerCaseQuery.includes("limit: 4") &&
        !lowerCaseQuery.includes("total") &&
        !lowerCaseQuery.includes("items")
      );
    }
  },
  {
    id: 8,
    title: "Только тип доставки",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        lowerCaseQuery.includes("query") &&
        lowerCaseQuery.includes("orders") &&
        lowerCaseQuery.includes("delivery") &&
        lowerCaseQuery.includes("type") &&
        !lowerCaseQuery.includes("address") &&
        !lowerCaseQuery.includes("delivered") &&
        !lowerCaseQuery.includes("deliveryDate")
      );
    }
  },
  {
    id: 9,
    title: "Только город в адресе доставки",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        lowerCaseQuery.includes("query") &&
        lowerCaseQuery.includes("orders") &&
        lowerCaseQuery.includes("delivery") &&
        lowerCaseQuery.includes("address") &&
        lowerCaseQuery.includes("city") &&
        !lowerCaseQuery.includes("street") &&
        !lowerCaseQuery.includes("zip") &&
        !lowerCaseQuery.includes("country") &&
        !lowerCaseQuery.includes("type") &&
        !lowerCaseQuery.includes("delivered") &&
        !lowerCaseQuery.includes("deliveryDate")
      );
    }
  },
  {
    id: 10,
    title: "Последний заказ пользователя",
    validate: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        lowerCaseQuery.includes("query") &&
        lowerCaseQuery.includes("orders") &&
        lowerCaseQuery.includes("limit: 1")
      );
    }
  }
]
