
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <p className="text-xl text-gray-600 mb-6">Страница не найдена</p>
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Ошибка навигации</AlertTitle>
            <AlertDescription>
              Запрашиваемый путь <strong>{location.pathname}</strong> не существует.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button onClick={() => navigate("/")} className="w-full">
            Вернуться на главную
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Перезагрузить страницу
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
