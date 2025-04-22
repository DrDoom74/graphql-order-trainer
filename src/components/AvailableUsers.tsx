
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, Copy } from "lucide-react";
import { users } from "@/data/users-mock";

interface AvailableUsersProps {
  onCopyUserId: (userId: string) => void;
}

export default function AvailableUsers({ onCopyUserId }: AvailableUsersProps) {
  const [open, setOpen] = React.useState(false);
  
  const handleCopy = (userId: string) => {
    onCopyUserId(userId);
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-1 text-sm !px-3 py-2 mr-2"
        onClick={() => setOpen(true)}
      >
        <Users className="w-4 h-4" />
        <span className="hidden sm:inline">Доступные userId</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> 
              Доступные пользователи
            </DialogTitle>
            <DialogDescription>
              Используйте эти ID в запросах orders(userId: "...")
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 mt-2">
            <div className="font-medium mb-2">📋 Пример запроса всех пользователей:</div>
            <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
{`{
  users {
    id
    name
  }
}`}
            </pre>
            
            <div className="font-medium mt-4 mb-2">👤 Список пользователей:</div>
            <div className="space-y-2">
              {users.map(user => (
                <div key={user.id} className="bg-gray-100 p-3 rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600 font-mono">ID: {user.id}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-500 hover:text-blue-700" 
                    onClick={() => handleCopy(user.id)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    <span className="text-xs">Использовать</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
