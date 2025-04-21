
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createYoga } from "@graphql-yoga/node";
import { orders } from './src/data/orders-mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { ViteDevServer, PreviewServer } from 'vite'; // Import both server types

// Define GraphQL schema (as string, could be moved to separate file)
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

const schema = makeExecutableSchema({ typeDefs, resolvers });
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

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: true,
    configureServer(server: ViteDevServer) {
      // Mount Yoga middleware at /api/graphql
      server.middlewares.use('/api/graphql', yoga);
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Add a plugin that handles the /api/graphql route in production builds
    {
      name: 'graphql-yoga-handler',
      // Fix the type signature for configurePreviewServer to use PreviewServer
      configurePreviewServer(server) {
        // Mount Yoga middleware for preview server (production-like)
        server.middlewares.use('/api/graphql', yoga);
      },
      configureServer(server: ViteDevServer) {
        // This is a duplicate for development mode, but ensures middleware is always mounted
        server.middlewares.use('/api/graphql', yoga);
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
