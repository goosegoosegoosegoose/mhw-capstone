import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import Homepage from "../Homepage";
import ArmorList from "../armors/ArmorList"
import ArmorDetail from "../armors/ArmorDetail"
import MonsterList from "../monsters/MonsterList";

const RoutesComp = ({login, logout, signup, loggedIn, edit, add, remove}) => {

  if (!loggedIn) {
    return (
      <Routes>
        <Route 
          path="/login" 
          element={<LoginForm login={login}/>}
        />
        <Route 
          path="/signup"
          element={<SignupForm signup={signup}/>} 
        />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/logout" />
      <Route path="/monsters" element={<MonsterList add={add} remove={remove}/>}/>
      <Route path="/ailments" />
      <Route path="/weapons" />
      <Route path="/armor-sets" />
      <Route path="/armors" element={<ArmorList add={add} remove={remove}/>}/>
      <Route path="/armors/:id" element={<ArmorDetail add={add} remove={remove}/>}/>
      <Route path="/armor-sets" />
      <Route path="/charms" />
      <Route path="/decorations" />
      <Route path="/items" />
      <Route path="/locations" />
    </Routes>
  )
}

export default RoutesComp;