
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link, Download, FileText } from "lucide-react";

interface ApiUriDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const apiUrl = "https://your-graphql-endpoint.example.com/graphql";
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

const handleDownloadSchema = () => {
  const schemaBlob = new Blob([graphqlOrdersSchema.trim()], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = "graphql_orders_schema.graphql";
  link.href = URL.createObjectURL(schemaBlob);
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, 100);
};

export default function ApiUriDialog({ open, onOpenChange }: ApiUriDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] w-[95vw] max-w-lg p-0 sm:p-0 flex flex-col"
        style={{ overflow: "visible" }}
      >
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4">
          <DialogTitle className="flex items-center text-lg font-semibold gap-2">
            <Link className="w-5 h-5 text-blue-500" /> API URI
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6 py-4 space-y-5 text-sm">
          <div>
            <div className="font-medium mb-1">GraphQL Endpoint:</div>
            <div className="flex items-center bg-gray-100 rounded px-3 py-2 cursor-text select-all">
              <span className="break-all mr-2">{apiUrl}</span>
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">Как добавить схему в Postman</div>
            <ol className="list-decimal ml-6 space-y-1">
              <li>Сохраните файл схемы, нажав кнопку <span className="inline-flex items-center gap-1"><FileText className="inline w-4 h-4" /> Скачать схему</span> ниже.</li>
              <li>В Postman создайте новый запрос (HTTP POST) на адрес выше.</li>
              <li>В разделе "APIs" или при создании коллекции выберите "Schema" и выберите скачанный файл <span className="font-mono text-xs">graphql_orders_schema.graphql</span>.</li>
              <li>Postman сам распознает тип GraphQL и даст возможность выполнять удобные запросы.</li>
            </ol>
          </div>
          <Button
            variant="outline"
            className="mt-2 gap-2"
            onClick={handleDownloadSchema}
          >
            <Download className="w-4 h-4" />
            Скачать схему (.graphql)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
