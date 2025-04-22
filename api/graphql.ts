
import { createYoga } from 'graphql-yoga';
import { orders } from '../src/data/orders-mock';
import { users } from '../src/data/users-mock';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Define the GraphQL schema
const typeDefs = /* GraphQL */ `
  type Query {
    orders(userId: ID!, limit: Int, offset: Int): [Order!]!
    users: [User!]!
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
  
  type User {
    id: ID!
    name: String
  }
`;

const resolvers = {
  Query: {
    orders: (_: any, { userId, limit, offset }: { userId: string, limit?: number, offset?: number }) => {
      console.log('GraphQL Query received:', { userId, limit, offset });
      
      // Check if userId exists
      const userExists = users.some(user => user.id === userId);
      if (!userExists) {
        throw new Error(`Пользователь с id '${userId}' не найден`);
      }
      
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
    users: () => {
      return users;
    }
  },
};

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create a standalone GraphQL server that returns JSON responses
const server = createYoga({
  schema,
  // Configure GraphQL server with proper options for API behavior
  cors: {
    origin: '*',
    credentials: true,
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  // Enable introspection for tools like Postman
  graphiql: false,
  landingPage: false,
  maskedErrors: false,
});

// Export the handler function
export const graphqlHandler = server;

// Export the GraphQL server for Vite middleware integration
export default server;
