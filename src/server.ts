
import express from 'express';
import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { orders } from './data/orders-mock';
import { users } from './data/users-mock';
import graphqlFields from 'graphql-fields';
import { pick } from 'lodash';

// Define GraphQL schema
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
      
      // Filter orders by userId if provided (currently ignored in mock)
      let filteredOrders = orders;

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
