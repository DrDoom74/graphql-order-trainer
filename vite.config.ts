
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import { createServer as createGraphQLServer } from '@graphql-yoga/node';
import { orders } from './src/data/orders-mock';

// Create GraphQL server instance
const graphqlServer = createGraphQLServer({
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
    // Custom middleware to handle GraphQL requests
    middlewares: [
      // This middleware intercepts requests to /api/graphql
      (req, res, next) => {
        if (req.url && req.url.startsWith('/api/graphql')) {
          // Handle GraphQL requests directly with yoga
          graphqlServer.handle(req, res);
          return; // Important: prevent further middleware execution
        }
        // For all other routes, continue with Vite's default handling
        next();
      }
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
