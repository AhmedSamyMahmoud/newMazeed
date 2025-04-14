import { ReactNode, createContext, useEffect, useState } from "react";
import Toast from "../components/toast";
import { Toasters } from "../helpers/toasters/Toasters";
import { IToastMessage } from "../types/toasters";

interface IToasterContext {
  showToast: (message: IToastMessage) => void;
}
export const ToasterContext = createContext<IToasterContext>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<IToastMessage>();
  function showToast(message: IToastMessage) {
    setMessage(message);
  }
  function handleToastDismiss() {
    setMessage(undefined);
  }
  useEffect(() => {
    Toasters.getInstance().setToasterActions({
      showToast,
    });
  }, []);
  return (
    <ToasterContext.Provider
      value={{
        showToast,
      }}
    >
      {message && (
        <Toast
          type={message?.type}
          title={message?.title}
          message={message?.message}
          onDismiss={handleToastDismiss}
        />
      )}
      {children}
    </ToasterContext.Provider>
  );
}
