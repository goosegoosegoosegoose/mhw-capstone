import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import UserContext from "./auth/userContext";

const Homepage = () => {
  const nav = useNavigate();
  const user = useContext(UserContext);

  if (!user) {
    return (
      <div className="container justify-content-center  text-center">
      <h1><b>MHW Wiki and Player Progression Tracker With a Semi-Working Mock Gearing Feature</b></h1>
        <h3>Sign up or login to gain access</h3>
        <Button variant="primary" size="lg" onClick={nav("/login")}>Log in</Button>
        <Button variant="primary" size="lg" onClick={nav("/signup")}>Sign up</Button>
    </div>
    )
  }

  return (
    <div className="container justify-content-center text-center">
      <h1><b>MHW Wiki and Player Progression Tracker With a Semi-Working Mock Gearing Feature</b></h1>
      <div>Welcome to my app</div>
    </div>
  )
}

export default Homepage;