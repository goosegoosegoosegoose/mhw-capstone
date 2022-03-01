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
              <a href="/login"><Button className="m-2" variant="primary" size="lg">Log in</Button></a>
              <a href="/signup"><Button className="m-2" variant="primary" size="lg">Sign up</Button></a>
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
              <a href="/monsters"><Button className="m-1" size="sm" variant="dark">monsters</Button></a>
              <a href="/locations"><Button className="m-1" size="sm" variant="dark">locations</Button></a>
              <a href="/armor-sets"><Button className="m-1" size="sm" variant="dark">armor sets</Button></a>
              <a href="/armor"><Button className="m-1" size="sm" variant="dark">armor</Button></a>
              <a href="/weapons"><Button className="m-1" size="sm" variant="dark">weapons</Button></a>
              <a href="/charms"><Button className="m-1" size="sm" variant="dark">charms</Button></a>
              <a href="/decorations"><Button className="m-1" size="sm" variant="dark">decorations</Button></a>
              <a href="/skills"><Button className="m-1" size="sm" variant="dark">skills</Button></a>
              <a href="/elements"><Button className="m-1" size="sm" variant="dark">elements</Button></a>
            </div>
            <h5 className="mt-4">Once done, visit the mock gearing page, or visit your profile page with all consolidated user info.</h5>
            <div>
              <a href={`/gearing/${user.username}`}><Button className="m-1" size="sm" variant="dark">gearing page</Button></a>
              <a href={`/profile/${user.username}`}><Button className="m-1" size="sm" variant="dark">profile</Button></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage;