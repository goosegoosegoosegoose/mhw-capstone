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
import WeaponTypeList from "../weapons/WeaponTypesList";
import WeaponList from "../weapons/WeaponList";
import WeaponDetail from "../weapons/WeaponDetail";
import EmailForm from "../auth/EmailForm";
import ProfilePage from "../user/ProfilePage";
import GearingPage from "../user/GearingPage";

const RoutesComp = ({login, signup, loggedIn, edit, add, remove, plus, minus, name}) => {

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="/" element={<Homepage />} />
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
      <Route path="/locations/:id" element={<LocationDetail add={add} remove={remove}/>}/>
      <Route path="/armor-sets" element={<ArmorSetList />}/>
      <Route path="/armor-sets/:id" element={<ArmorSetDetail add={add} remove={remove}/>}/>
      <Route path="/armor" element={<ArmorList add={add} remove={remove}/>}/>
      <Route path="/armor/:id" element={<ArmorDetail add={add} remove={remove}/>}/>
      <Route path="/weapons" element={<WeaponTypeList />}/>
      <Route path="/weapons/:type" element={<WeaponList add={add} remove={remove}/>}/>
      <Route path="/weapons/w/:id" element={<WeaponDetail add={add} remove={remove}/>}/>
      <Route path="/charms" element={<CharmList add={add} remove={remove}/>}/>
      <Route path="/charms/:id" element={<CharmDetail add={add} remove={remove}/>}/>
      <Route path="/decorations" element= {<DecorationList plus={plus} minus={minus}/>}/>
      <Route path="/decorations/:id" element= {<DecorationDetail plus={plus} minus={minus}/>}/>
      <Route path="/skills" element={<SkillList />}/>
      <Route path="/skills/:id" element={<SkillDetail add={add} remove={remove}/>}/>
      <Route path="/elements" element={<ElementList />}/>
      <Route path="/elements/:ele" element={<ElementDetail add={add} remove={remove}/>}/>
      <Route path="/email/edit" element={<EmailForm edit={edit}/>}/>
      <Route path="/profile/:username" element={<ProfilePage add={add} remove={remove} plus={plus} minus={minus} name={name}/>}/>
      <Route path="/gearing/:username" element={<GearingPage />} />
    </Routes>
  )
}

export default RoutesComp;