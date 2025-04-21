
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SchemaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const graphqlOrdersSchema = `
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

export default function SchemaDialog({ open, onOpenChange }: SchemaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] w-[95vw] max-w-2xl p-0 overflow-hidden sm:p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0 border-b px-6 py-4 relative">
            <DialogTitle className="flex items-center text-lg font-semibold gap-2">
              📘 Схема API
            </DialogTitle>
            <button
              aria-label="Закрыть"
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 focus:outline-none transition"
              onClick={() => onOpenChange(false)}
              tabIndex={0}
              type="button"
            >
              ❌
            </button>
          </DialogHeader>
          <div
            className="flex-1 overflow-auto bg-gray-900 text-white px-6 py-4 font-mono text-sm rounded-b-lg"
            style={{ minHeight: "200px", whiteSpace: "pre-wrap" }}
          >
            {graphqlOrdersSchema}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

