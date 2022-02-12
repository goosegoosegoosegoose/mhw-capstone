import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import Homepage from "../Homepage";
import ArmorList from "../armor/ArmorList"
import ArmorDetail from "../armor/ArmorDetail"
import MonsterList from "../monsters/MonsterList";
import MonsterDetail from "../monsters/MonsterDetail";
import LocationList from "../locations/LocationList";
import LocationDetail from "../locations/LocationDetail";
import ElementList from "../elements/ElementList";
import ElementDetail from "../elements/ElementDetail";
import CharmList from "../charms/CharmList";
import CharmDetail from "../charms/CharmDetail";
import ArmorSetList from "../armorsets/ArmorSetList";
import ArmorSetDetail from "../armorsets/ArmorSetDetail";
import SkillList from "../skills/SkillList";
import SkillDetail from "../skills/SkillDetail";
import DecorationList from "../decorations/DecorationList";
import DecorationDetail from "../decorations/DecorationDetail";

const RoutesComp = ({login, logout, signup, loggedIn, edit, add, remove, plus, minus}) => {

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
      <Route path="/" element={<Homepage />} />
      <Route path="/monsters" element={<MonsterList add={add} remove={remove}/>}/>
      <Route path="/monsters/:id" element={<MonsterDetail add={add} remove={remove}/>}/>
      <Route path="/locations" element={<LocationList />}/>
      <Route path="/locations/:id" element={<LocationDetail />}/>
      <Route path="/armor-sets" element={<ArmorSetList />}/>
      <Route path="/armor-sets/:id" element={<ArmorSetDetail add={add} remove={remove}/>}/>
      <Route path="/armor" element={<ArmorList add={add} remove={remove}/>}/>
      <Route path="/armor/:id" element={<ArmorDetail add={add} remove={remove}/>}/>
      <Route path="/weapons" />
      <Route path="/charms" element={<CharmList add={add} remove={remove}/>}/>
      <Route path="/charms/:id" element={<CharmDetail add={add} remove={remove}/>}/>
      <Route path="/decorations" element= {<DecorationList plus={plus} minus={minus}/>}/>
      <Route path="/decorations/:id" element= {<DecorationDetail plus={plus} minus={minus}/>}/>
      <Route path="/skills" element={<SkillList />}/>
      <Route path="/skills/:id" element={<SkillDetail add={add} remove={remove}/>}/>
      <Route path="/elements" element={<ElementList />}/>
      <Route path="/elements/:ele" element={<ElementDetail />}/>
      <Route path="/logout" />
    </Routes>
  )
}

export default RoutesComp;