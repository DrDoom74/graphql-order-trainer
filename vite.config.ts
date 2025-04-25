
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createYoga } from "graphql-yoga";
import { orders } from './src/data/orders-mock';
import { users } from './src/data/users-mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import graphqlFields from 'graphql-fields';
import lodash from 'lodash';
import type { ViteDevServer, PreviewServer } from 'vite';
import type { GraphQLResolveInfo } from 'graphql';

const { pick } = lodash;

// Define types for resolver parameters and context
interface ResolverContext {
  // Add any context properties here if needed
}

// Define the shape of order items
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Define the shape of address
interface Address {
  street: string;
  city: string;
  zip: string;
  country: string;
}

// Define the shape of delivery
interface Delivery {
  delivered: boolean;
  deliveryDate: string | null;
  type: string;
  address: Address;
}

// Define the shape of an order
interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  delivery: Delivery;
}

// Define the shape of a user
interface User {
  id: string;
  name: string;
}

const typeDefs = /* GraphQL */ `
  type Query {
    orders(userId: ID!, delivered: Boolean, country: String, limit: Int, offset: Int): [Order!]!
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
    orders: (_: unknown, { userId, delivered, country, limit, offset }: { 
      userId: string; 
      delivered?: boolean; 
      country?: string;
      limit?: number; 
      offset?: number 
    }, context: ResolverContext, info: GraphQLResolveInfo) => {
      console.log('GraphQL Query received:', { userId, delivered, country, limit, offset });

      // Check if userId exists
      const userExists = users.some(user => user.id === userId);
      if (!userExists) {
        throw new Error(`Пользователь с id '${userId}' не найден`);
      }

      // Get requested fields
      const fields = graphqlFields(info) as Record<string, any>;
      
      // Apply filters
      let filteredOrders = orders;

      // Filter by delivery status if provided
      if (delivered !== undefined) {
        filteredOrders = filteredOrders.filter(order => order.delivery.delivered === delivered);
      }

      // Filter by country if provided
      if (country !== undefined && country !== '') {
        filteredOrders = filteredOrders.filter(order => order.delivery.address.country === country);
      }

      // Apply pagination if provided
      if (offset !== undefined) {
        filteredOrders = filteredOrders.slice(offset);
      }

      if (limit !== undefined) {
        filteredOrders = filteredOrders.slice(0, limit);
      }

      // Return only requested fields
      return filteredOrders.map(order => {
        // Handle nested fields
        const result: Record<string, any> = {};
        
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
            result[field] = order[field as keyof Order];
          }
        });
        
        return result;
      });
    },
    users: (_: unknown, args: unknown, context: ResolverContext, info: GraphQLResolveInfo) => {
      // Get requested fields
      const fields = graphqlFields(info) as Record<string, any>;
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
