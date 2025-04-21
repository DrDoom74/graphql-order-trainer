
// This file used to re-export the schema, but we'll make it cleaner
// by directly importing orders from the mock data
import { orders } from './orders-mock';

// Export only what's needed - the orders data for the GraphQL resolver
export { orders as ordersMock };
