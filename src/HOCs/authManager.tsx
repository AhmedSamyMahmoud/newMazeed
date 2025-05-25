import { useEffect, useState } from "react";
import { useAuth } from "../apis/auth";
import { Loader2 } from "lucide-react";

export function withAuthManager<propType>(Component: any) {
  const Loader = () => {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-5 w-5 text-primary animate-spin" />
      </div>
    );
  };

  return (props: propType) => {
    const auth = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    const checkAuth = () => {
      if (!auth.token) {
        console.log("User is not authenticated");
        window.location.href = "/login";
      } else {
        setIsChecking(false);
      }
    };

    useEffect(() => {
      checkAuth();
    }, [auth]);

    if (isChecking) {
      return <Loader />;
    }
    return <Component {...props} />;
  };
}
