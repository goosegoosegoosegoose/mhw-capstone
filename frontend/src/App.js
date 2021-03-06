import React, { useEffect, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import Routes from "./route-nav/Routes";
import Navbar from "./route-nav/Navbar";
import MhwApi from "./api";
import UserContext from "./auth/userContext";
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(token !== "null" ? true : false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const getNewUserInfo = async () => {
      const res = await MhwApi.getCurrentUser(username);
      setCurrentUser(c => ({...currentUser, ...res.user}));
    };
    if (username === "null" || username === "") {
      return;
    };
    getNewUserInfo();
  }, [token, username]);
  
  const login = async (data) => {
    try {
      const res = await MhwApi.login(data);
      localStorage.setItem("username", data.username);
      localStorage.setItem("token", res.token);
      MhwApi.refreshToken();
      setToken(res.token);
      setUsername(data.username);
      setLoggedIn(true);
      nav("/");
    } catch (e) {
      setError(`Login failed. Error: ${e[0]}`)
    }
  };
  
  const logout = () => {
    localStorage.setItem("token", null);
    localStorage.setItem("username", null);
    MhwApi.refreshToken();
    setToken(null);
    setCurrentUser({});
    setUsername(null);
    setLoggedIn(false);
    nav("/");
  };

  const signup = async (data) => {
    try {
      const res = await MhwApi.register(data);
      localStorage.setItem("username", data.username);
      localStorage.setItem("token", res.token);
      MhwApi.refreshToken();
      setToken(res.token);
      setUsername(data.username);
      setLoggedIn(true);
      nav("/");
    } catch (e) {
      setError(`Sign up failed. Error: ${e[0]}`)
    }
  };

  const edit = async (edit) => {
    const res = await MhwApi.profileEdit(edit, currentUser.username);
    setCurrentUser({...currentUser, ...res});
  };

  const add = async (id, type) => {
    const res = await MhwApi.add(type, currentUser.username, id);
    setCurrentUser({...currentUser, [type]: [...currentUser[type], Number(res.id)]});
  }

  const remove = async (id, type) => {
    const res = await MhwApi.remove(type, currentUser.username, id);
    currentUser[type] = currentUser[type].filter(i => i === Number(res.id) ? false : true);
    setCurrentUser({...currentUser, [type]: [...currentUser[type]]});
  }

  const plus = async (id) => {
    const res = await MhwApi.add("decorations", currentUser.username, id);
    if (!currentUser.decorations[id]) {
      setCurrentUser({...currentUser, "decorations": {...currentUser.decorations, [res.id]:1}})
    } else {
      setCurrentUser({...currentUser, "decorations": {...currentUser.decorations, [res.id]:currentUser.decorations[res.id] + 1}})
    }
  }

  const minus = async (id) => {
    const res = await MhwApi.remove("decorations", currentUser.username, id);
    if (currentUser.decorations[id] === 1) {
      delete currentUser.decorations[id];
      setCurrentUser({...currentUser, "decorations": {...currentUser.decorations}})
    } else {
      setCurrentUser({...currentUser, "decorations": {...currentUser.decorations, [res.id]:currentUser.decorations[res.id] - 1}})
    }
  }

  return (
    <UserContext.Provider value={currentUser}>
      <Navbar 
        login={login}
        logout={logout}
        signup={signup}
        loggedIn={loggedIn}
        edit={edit}
        name={currentUser.username}
      />
      <div>
        <Routes 
          login={login}
          signup={signup}
          loggedIn={loggedIn}
          edit={edit}
          add={add}
          remove={remove}
          plus={plus}
          minus={minus}
          error={error}
        />
      </div>
    </UserContext.Provider>
  )
}

export default App;
