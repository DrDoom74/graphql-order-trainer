
import { createServer } from '@graphql-yoga/node';
import { ordersMock } from '../src/data/orders-schema';

// Create the GraphQL server
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
  // Enable CORS for all origins
  cors: {
    origin: '*',
    credentials: true,
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  // Configure behavior for different HTTP methods
  graphiql: false, // Disable GraphiQL UI in production
  landingPage: false, // Disable landing page
  maskedErrors: false, // Show detailed errors
});

// Export a function that processes the request
export default server;
