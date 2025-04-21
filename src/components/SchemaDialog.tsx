
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
      <DialogContent
        className="max-h-[80vh] w-[95vw] max-w-2xl p-0 sm:p-0 flex flex-col"
        style={{ overflow: "visible" }} // чтобы можно было прокручивать вложенный элемент
      >
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4 relative">
          <DialogTitle className="flex items-center text-lg font-semibold gap-2">
            📘 Схема API
          </DialogTitle>
        </DialogHeader>
        {/* Блок со скроллом */}
        <div
          className="flex-1 min-h-[200px] h-full overflow-auto bg-gray-900 text-white px-6 py-4 font-mono text-sm rounded-b-lg"
          style={{
            maxHeight: "60vh",
            whiteSpace: "pre-wrap"
          }}
        >
          {graphqlOrdersSchema}
        </div>
      </DialogContent>
    </Dialog>
  );
}
