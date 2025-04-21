
const graphqlOrdersSchema = `
type Query {
  orders(userId: ID!, limit: Int, offset: Int): [Order!]!
}

type Order {
  id: ID!
  date: String!
  status: String!
  total: Float!
  items: [OrderItem!]!
  delivery: Delivery!
}

type OrderItem {
  name: String!
  quantity: Int!
  price: Float!
}

type Delivery {
  delivered: Boolean!
  deliveryDate: String
  type: String!
  address: Address!
}

type Address {
  street: String!
  city: String!
  zip: String!
  country: String!
}
`;

export default graphqlOrdersSchema;

