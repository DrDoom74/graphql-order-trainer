
import { createServer } from '@graphql-yoga/node';
import { orders } from '../src/data/orders-mock';

// Create a standalone GraphQL server that returns JSON responses
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
          console.log('GraphQL Query received:', { userId, limit, offset });
          
          // Filter orders by userId if provided (currently ignored in mock)
          let filteredOrders = orders;
          
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
  // Configure GraphQL server with proper options for API behavior
  cors: {
    origin: '*',
    credentials: true,
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  // Enable introspection for tools like Postman
  graphiql: false, // Disable GraphiQL UI in production
  landingPage: false, // Disable landing page to prevent HTML responses
  maskedErrors: false, // Show detailed errors for debugging
});

// Export the handler function
export const graphqlHandler = server.handle.bind(server);

// Export the GraphQL server for Vite middleware integration
export default server;
