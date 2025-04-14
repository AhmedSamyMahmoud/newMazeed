import { useEffect } from "react";
import { useAuth } from "../apis/auth";

export function withAuthManager<propType>(Component: any) {
  return (props: propType) => {
    const auth = useAuth();
    useEffect(() => {
      if (!auth.token) {
        console.log("User is authenticated");
        window.location.href = "/login";
      }
    }, [auth]);
    return <Component {...props} />;
  };
}