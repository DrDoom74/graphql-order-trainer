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
import { createServer as createHttpServer } from 'node:http';

const { pick } = lodash;

interface ResolverContext {
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Address {
  street: string;
  city: string;
  zip: string;
  country: string;
}

interface Delivery {
  delivered: boolean;
  deliveryDate: string | null;
  type: string;
  address: Address;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  delivery: Delivery;
}

interface User {
  id: string;
  name: string;
}

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
    orders: (_: unknown, { userId, limit, offset }: { userId: string; limit?: number; offset?: number }, context: ResolverContext, info: GraphQLResolveInfo) => {
      console.log('GraphQL Query received:', { userId, limit, offset });

      const userExists = users.some(user => user.id === userId);
      if (!userExists) {
        throw new Error(`Пользователь с id '${userId}' не найден`);
      }

      const fields = graphqlFields(info) as Record<string, any>;
      
      let filteredOrders = orders;

      if (offset !== undefined) {
        filteredOrders = filteredOrders.slice(offset);
      }

      if (limit !== undefined) {
        filteredOrders = filteredOrders.slice(0, limit);
      }

      return filteredOrders.map(order => {
        const result: Record<string, any> = {};
        
        Object.keys(fields).forEach(field => {
          if (field === 'items' && 'items' in fields) {
            result['items'] = order.items.map(item => 
              pick(item, Object.keys(fields.items))
            );
          } else if (field === 'delivery' && 'delivery' in fields) {
            result['delivery'] = { ...pick(order.delivery, Object.keys(fields.delivery)) };
            
            if ('address' in fields.delivery) {
              result['delivery']['address'] = pick(
                order.delivery.address, 
                Object.keys(fields.delivery.address)
              );
            }
          } else {
            result[field] = order[field as keyof Order];
          }
        });
        
        return result;
      });
    },
    users: (_: unknown, args: unknown, context: ResolverContext, info: GraphQLResolveInfo) => {
      const fields = graphqlFields(info) as Record<string, any>;
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
  logging: {
    debug: (...args) => console.log('GraphQL Debug:', ...args),
    info: (...args) => console.log('GraphQL Info:', ...args),
    warn: (...args) => console.log('GraphQL Warning:', ...args),
    error: (...args) => console.error('GraphQL Error:', ...args),
  },
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
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api/graphql')) {
            console.log('Dev server: GraphQL request received');
            const httpServer = createHttpServer();
            httpServer.on('request', (nodeReq, nodeRes) => {
              yoga(nodeReq, nodeRes);
            });
            httpServer.emit('request', req, res);
          } else {
            next();
          }
        });
      },
      configurePreviewServer(server: PreviewServer) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api/graphql')) {
            console.log('Preview server: GraphQL request received');
            const httpServer = createHttpServer();
            httpServer.on('request', (nodeReq, nodeRes) => {
              yoga(nodeReq, nodeRes);
            });
            httpServer.emit('request', req, res);
          } else {
            next();
          }
        });
      },
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
