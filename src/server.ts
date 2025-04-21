
import express from 'express';
import { createYoga } from '@graphql-yoga/node';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { orders } from './data/orders-mock';

// Define GraphQL schema
const typeDefs = /* GraphQL */ `
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

const resolvers = {
  Query: {
    orders: (_: unknown, { userId, limit, offset }: { userId: string, limit?: number, offset?: number }) => {
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
};

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create a standalone GraphQL server
const yoga = createYoga({
  schema,
  cors: {
    origin: '*',
    credentials: true,
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  graphiql: false,
  landingPage: false,
  maskedErrors: false,
});

// Function to create and configure express server with GraphQL
export function createServer() {
  const app = express();
  
  // Mount GraphQL middleware
  app.use('/api/graphql', yoga);
  
  // Serve static files from dist directory in production
  app.use(express.static('dist'));
  
  return app;
}

// If this file is run directly (not imported)
if (require.main === module) {
  const port = process.env.PORT || 3000;
  const app = createServer();
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/api/graphql`);
  });
}
