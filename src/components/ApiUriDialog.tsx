
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link, Download, ExternalLink } from "lucide-react";
import graphqlOrdersSchema from "@/data/graphqlSchema";

interface ApiUriDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const apiUrl = "https://graphql-order-trainer.lovable.app/api/graphql";

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
          <DialogDescription className="text-xs opacity-70 mt-1">
            GraphQL API для выполнения запросов
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6 py-4 space-y-5 text-sm">
          <div>
            <div className="font-medium mb-1">🔗 GraphQL Endpoint:</div>
            <div className="flex items-center bg-gray-100 rounded px-3 py-2 cursor-text select-all">
              <span className="break-all mr-2">{apiUrl}</span>
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">📋 Тестовый GraphQL-запрос (curl):</div>
            <div className="bg-gray-800 text-white rounded px-3 py-2 text-xs overflow-x-auto whitespace-pre">
{`curl -X POST ${apiUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ orders(userId: \\"u123\\") { id status total } }"}'`}
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">📘 Как добавить схему в Postman:</div>
            <ol className="list-decimal ml-6 space-y-1">
              <li>Скачайте файл схемы, нажав кнопку <span className="inline-flex items-center gap-1"><Download className="inline w-4 h-4" /> Скачать схему</span> ниже.</li>
              <li>В Postman создайте новый запрос (тип: POST) по адресу выше.</li>
              <li>Перейдите в раздел APIs или создайте коллекцию.</li>
              <li>В настройках выберите Schema → Import → выберите файл <span className="font-mono text-xs">graphql_orders_schema.graphql</span>.</li>
              <li>Postman автоматически определит структуру и позволит удобно писать запросы.</li>
            </ol>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className="mt-2 gap-2"
              onClick={handleDownloadSchema}
            >
              <Download className="w-4 h-4" />
              Скачать схему (.graphql)
            </Button>
            <a 
              href="https://www.postman.com/downloads/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                className="mt-2 gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Скачать Postman
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
