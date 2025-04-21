
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createYoga } from "@graphql-yoga/node";
import { orders } from './src/data/orders-mock';
import { makeExecutableSchema } from '@graphql-tools/schema';

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
    orders: (_: any, { userId, limit, offset }: { userId: string, limit?: number, offset?: number }) => {
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

// Create GraphQL server with correct schema format
const graphqlServer = createYoga({
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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewares: [
      // Handle GraphQL requests
      (req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api/graphql')) {
          // Handle GraphQL requests through the yoga server
          graphqlServer.handle(req, res);
          return;
        }
        next();
      },
    ],
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
