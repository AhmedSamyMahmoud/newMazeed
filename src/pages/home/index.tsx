import React from "react";
import { useAuth } from "../../apis/auth";
import { withAuthManager } from "../../HOCs/authManager";

function Home() {
  const auth = useAuth();
  return (
    <div>
      <div>
        <h1>Welcome to the Home Page</h1>
        <button onClick={() => auth.logout()}>Logout</button>
      </div>
      <div></div>
    </div>
  );
}

export default withAuthManager(Home);
