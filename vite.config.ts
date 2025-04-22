
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createYoga } from "graphql-yoga";
import { orders } from './src/data/orders-mock';
import { users } from './src/data/users-mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import graphqlFields from 'graphql-fields';
import { pick } from 'lodash';
import type { ViteDevServer, PreviewServer } from 'vite';

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
    orders: (_, { userId, limit, offset }, context, info) => {
      console.log('GraphQL Query received:', { userId, limit, offset });

      // Check if userId exists
      const userExists = users.some(user => user.id === userId);
      if (!userExists) {
        throw new Error(`Пользователь с id '${userId}' не найден`);
      }

      // Get requested fields
      const fields = graphqlFields(info);
      
      let filteredOrders = orders;

      if (offset !== undefined) {
        filteredOrders = filteredOrders.slice(offset);
      }

      if (limit !== undefined) {
        filteredOrders = filteredOrders.slice(0, limit);
      }

      // Return only requested fields
      return filteredOrders.map(order => {
        // Handle nested fields
        const result = {};
        
        Object.keys(fields).forEach(field => {
          if (field === 'items' && 'items' in fields) {
            // Handle items selection
            result['items'] = order.items.map(item => 
              pick(item, Object.keys(fields.items))
            );
          } else if (field === 'delivery' && 'delivery' in fields) {
            // Handle delivery selection and its nested address
            result['delivery'] = { ...pick(order.delivery, Object.keys(fields.delivery)) };
            
            if ('address' in fields.delivery) {
              result['delivery']['address'] = pick(
                order.delivery.address, 
                Object.keys(fields.delivery.address)
              );
            }
          } else {
            // Handle top-level fields
            result[field] = order[field];
          }
        });
        
        return result;
      });
    },
    users: (_, args, context, info) => {
      // Get requested fields
      const fields = graphqlFields(info);
      // Return only requested fields
      return users.map(user => pick(user, Object.keys(fields)));
    }
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
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'graphql-yoga-handler',
      configureServer(server: ViteDevServer) {
        server.middlewares.use('/api/graphql', yoga);
      },
      configurePreviewServer(server: PreviewServer) {
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
