
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import graphqlOrdersSchema from "@/data/graphqlSchema";

interface SchemaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SchemaDialog({ open, onOpenChange }: SchemaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] w-[95vw] max-w-2xl p-0 sm:p-0 flex flex-col"
        style={{ overflow: "visible" }}
      >
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4 relative">
          <DialogTitle className="flex items-center text-lg font-semibold gap-2">
            📘 Схема API
          </DialogTitle>
          <DialogDescription className="text-xs opacity-70 mt-1">
            GraphQL схема для API заказов
          </DialogDescription>
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
