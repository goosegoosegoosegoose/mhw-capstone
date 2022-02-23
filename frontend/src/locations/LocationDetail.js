import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MhwApi from "../api";
import MonsterCard from "../monsters/MonsterCard";

const LocationDetail = ({add, remove}) => {
  const [location, setLocation] = useState({});
  const { id } = useParams();

  useEffect(function fetchLocationWhenMounted () {
    async function fetchLocation() {
      const res = await MhwApi.getOne("locations", id);
      setLocation(res);
    }
    fetchLocation();
  }, []);

  if (!location.monsters) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <div className="container">
      <h1 className="m-1">{location.name}</h1>
      <p className="m-1 mt-3">Zone Count: {location.zone_count}</p>
      Camps:
      <ul>
        {location.camps.map(c => 
          <li key={c.id}>{c.name}</li>
        )}
      </ul>
      {location.monsters.length > 0 ? 
      <div>
        <h4>Monsters that spawn here:</h4>
        <div className="text-center">
          <div className="row justify-content-center">
            {location.monsters.map(m => 
              <MonsterCard
                key={m.id}
                id={m.id}
                name={m.name}
                icon={m.icon}
                add={add}
                remove={remove}
              />
            )}
          </div>
        </div>
      </div> : <h4>No spawns, just summons</h4>}
      <h4 className="mt-4 mb-2">Images:</h4>
      <div className="row justify-content-center">
        {location.imgs.map(i => 
          <div className="col-sm-6">
            <img src={i} className="img-responsive img-fluid my-2"/>
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationDetail;