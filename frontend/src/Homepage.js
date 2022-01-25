import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./auth/userContext";

const Homepage = () => {
  const nav = useNavigate();
  const user = useContext(UserContext);

  if (!user) {
    return (
      <div className="container text-center" style={{ backgroundImage: `url("https://store-images.s-microsoft.com/image/apps.60377.67926658307646239.e8130cbd-e4b6-4c78-9fe9-424eb8a64ab1.78a5c2e6-56b7-4d89-9637-cb1f1e24a0b7?mode=scale&q=90&h=1080&w=1920")`}}>
      <h1><b>MHW App</b></h1>
        <p>Sign up or login to gain access</p><br/>
        <button onClick={nav("/login")}>Log in</button>
        <button onClick={nav("/signup")}>Sign up</button>
    </div>
    )
  }

  return (
    <div className="container" style={{ backgroundImage: `url("https://i.redd.it/xdcvxl1mz4531.png")`}}>
      map blurry I need to add buttons somehow?
    </div>
  )

}

export default Homepage;