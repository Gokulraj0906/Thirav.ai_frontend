import { createContext, useContext } from "react";

interface ToastContextType {
  toast: (options: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = (options: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    console.log("Toast:", options);
  };

  return <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>;
}