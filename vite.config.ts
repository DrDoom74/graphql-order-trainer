import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createYoga } from "@graphql-yoga/node";
import { orders } from './src/data/orders-mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { ViteDevServer, PreviewServer } from 'vite';

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

      let filteredOrders = orders;

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
      server.middlewares.use('/api/graphql', yoga);
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'graphql-yoga-handler',
      configurePreviewServer(server: PreviewServer) {
        server.middlewares.use('/api/graphql', yoga);
      },
      configureServer(server: ViteDevServer) {
        server.middlewares.use('/api/graphql', yoga);
      },
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
