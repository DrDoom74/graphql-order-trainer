
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import graphqlOrdersSchema from "@/data/graphqlSchema";
import { X, Book } from "lucide-react";

interface SchemaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SchemaDialog({ open, onOpenChange }: SchemaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] w-[95vw] max-w-2xl p-0 overflow-hidden sm:p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0 border-b px-6 py-4">
            <DialogTitle className="flex items-center text-lg font-semibold gap-2">
              <Book className="w-5 h-5 text-blue-600 mr-2" />
              Схема API
            </DialogTitle>
            <button
              aria-label="Закрыть"
              className="ml-auto rounded-full p-2 hover:bg-gray-100 focus:outline-none absolute right-4 top-4 transition"
              onClick={() => onOpenChange(false)}
              tabIndex={0}
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-gray-900 text-white px-6 py-4 font-mono text-sm rounded-b-lg" style={{ minHeight: "200px" }}>
            <pre className="whitespace-pre-wrap"><code>{graphqlOrdersSchema}</code></pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
