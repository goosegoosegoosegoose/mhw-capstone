import React, { useState, useEffect } from "react";
import MhwApi from "../api";
import SearchForm from "../common/SearchForm";
import WeaponTypeCard from "./WeaponTypeCard";

const WeaponTypeList = () => {
  const [weaponTypes, setWeaponTypes] = useState([]);

  useEffect(function fetchWeaponTypesWhenMounted() {
    async function fetchWeaponTypes() {
      const res = await MhwApi.request("weapons");
      setWeaponTypes(res)
    }
    fetchWeaponTypes()
  }, []);

  const getWeaponTypes = (res) => {
    setWeaponTypes([...res])
  }

  if (!weaponTypes) {
    return (
      <div className="container text-center">
        <p>Loading</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <SearchForm type="weapons" header="type" get={getWeaponTypes} />
      <div className="row justify-content-center">
        {weaponTypes.map(t => 
          <WeaponTypeCard
            key={t.type}
            type={t.type}
            img={t.img}
          />
        )}
      </div>
  </div>
  )
}

export default WeaponTypeList;