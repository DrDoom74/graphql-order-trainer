
import { createServer } from '@graphql-yoga/node';
import { ordersMock } from '../src/data/orders-schema';

const server = createServer({
  schema: {
    typeDefs: /* GraphQL */ `
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
    `,
    resolvers: {
      Query: {
        orders: (_, { userId, limit, offset }) => {
          // Filter orders by userId if provided
          let filteredOrders = ordersMock;
          
          // Apply pagination if provided
          if (offset !== undefined) {
            filteredOrders = filteredOrders.slice(offset);
          }
          
          if (limit !== undefined) {
            filteredOrders = filteredOrders.slice(0, limit);
          }
          
          return filteredOrders;
        },
      },
    },
  },
  cors: {
    origin: '*',
    credentials: true,
  },
});

export default server;
