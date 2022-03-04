import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import UserContext from "./auth/userContext";

const Homepage = () => {
  const nav = useNavigate();
  const user = useContext(UserContext);

  if (!user.username) {
    return (
      <div className="container justify-content-center text-center">
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '70vh'}}>
          <div className="row">
            <div>
              <h1><b>MHW Wiki and Player Progression Tracker</b></h1>
              <h3>Sign up or login to gain access</h3>
            </div>
            <div>
              <Button className="m-2" variant="primary" size="lg" onClick={()=> nav("/login")}>Log in</Button>
              <Button className="m-2" variant="primary" size="lg" onClick={()=> nav("/signup")}>Sign up</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container justify-content-center text-center">
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '70vh'}}>
        <div className="row">
          <h1 className="mb-5"><b>MHW Wiki and Player Progression Tracker</b></h1>
          <div>
            <div>
              <b>Monster Hunter: World</b> is a action role playing game developed by Capcom. <br/>
              The main gameplay loop is defeating monsters to harvest materials to forge armor/weapons <br/>
              to defeat even stronger monsters to create even stronger equipment. <br/><br/>
              This app was created to help players keep track of game progression and consolidate that info into <br/>
              a working gearing system that is less cluttered than what is in the game.
            </div>
            <h5 className="mt-4">Get started by visiting the various pages and record your progression.</h5>
            <div>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav("/monsters")}>monsters</Button>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav("/locations")}>locations</Button>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav("/armor-sets")}>armor sets</Button>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav("/armor")}>armor</Button>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav("/weapons")}>weapons</Button>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav("/charms")}>charms</Button>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav("/decorations")}>decorations</Button>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav("/skills")}>skills</Button>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav("/elements")}>elements</Button>
            </div>
            <h5 className="mt-4">Once done, visit the mock gearing page, or visit your profile page with all consolidated user info.</h5>
            <div>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav(`/gearing/${user.username}`)}>gearing page</Button>
              <Button className="m-1" size="sm" variant="dark" onClick={()=> nav(`/profile/${user.username}`)}>profile</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage;