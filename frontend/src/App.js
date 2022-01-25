import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./route-nav/Routes";
import Navbar from "./route-nav/Navbar";
import MhwApi from "./api";
import UserContext from "./auth/userContext";
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(token !== null ? true : false);

  useEffect(() => {
    const getNewUserInfo = async () => {
      const res = await MhwApi.getUser(username);
      setCurrentUser({...currentUser, ...res.user});
    };
    if (username !== null) {
      getNewUserInfo();
    }
    return;
  }, [token, username]);
  
  console.log(currentUser);

  const login = async (data) => {
    const res = await MhwApi.login(data);
    localStorage.setItem("username", data.username);
    localStorage.setItem("token", res.token);
    MhwApi.refreshToken();
    setToken(res.token);
    setUsername(data.username);
    setLoggedIn(true);
  };
  
  const logout = () => {
    localStorage.setItem("token", null);
    localStorage.setItem("username", null);
    MhwApi.refreshToken();
    setToken(null);
    setCurrentUser({});
    setUsername(null);
    setLoggedIn(false);
  };

  const signup = async (data) => {
    const res = await MhwApi.register(data);
    localStorage.setItem("username", data.username);
    localStorage.setItem("token", res.token);
    MhwApi.refreshToken();
    setToken(res.token);
    setUsername(data.username);
    setLoggedIn(true);
  };

  const edit = async (edit) => {
    const res = await MhwApi.profileEdit(edit, currentUser.username);
    setCurrentUser({...currentUser, ...res});
  };

  const add = async (evt) => {
    const id = evt.target.id;
    const type = evt.target.dataset.type;
    console.log(currentUser);
    const res = await MhwApi.add(type, currentUser.username, id);
    setCurrentUser({...currentUser, [type]: [...currentUser[type], res]});
  }

  const remove = async (evt) => {
    const id = evt.target.id;
    const type = evt.target.dataset.type;
    await MhwApi.remove(type, currentUser.username, id);
    setCurrentUser({...currentUser, [type]: [...currentUser[type]]});
    
  }

  // username is unidentified, type is "submit", prob should use dataset

  return (
    <BrowserRouter>
      <UserContext.Provider value={currentUser}>
        <Navbar 
          login={login}
          logout={logout}
          signup={signup}
          loggedIn={loggedIn}
          edit={edit}
        />
        <Routes 
          login={login}
          logout={logout}
          signup={signup}
          loggedIn={loggedIn}
          edit={edit}
          add={add}
          remove={remove}
        />
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App;
