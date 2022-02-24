import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./auth/userContext";

const Homepage = () => {
  const nav = useNavigate();
  const user = useContext(UserContext);

  if (!user) {
    return (
      <div className="container text-center">
      <h1><b>MHW App</b></h1>
        <p>Sign up or login to gain access</p><br/>
        <button onClick={nav("/login")}>Log in</button>
        <button onClick={nav("/signup")}>Sign up</button>
    </div>
    )
  }

  return (
    <div className="container justify-content-center text-center">
      <div>Welcome to my app</div>
    </div>
  )
}

export default Homepage;