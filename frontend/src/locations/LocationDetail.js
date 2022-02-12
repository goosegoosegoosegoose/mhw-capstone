import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MonsterCard from "../monsters/MonsterCard";

const LocationDetail = () => {
  const [location, setLocation] = useState({});
  // const nav = useNavigate();
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
      <ul>
        {location.camps.map(c => 
          <li key={c.id}>{c.name}</li>
        )}
      </ul>
      {location.monsters.length > 0 ? 
      <div>
        <p>Monsters that spawn here:</p>
        <div className="text-center">
          <div className="row">
            {location.monsters.map(m => 
              <MonsterCard
                key={m.id}
                id={m.id}
                name={m.name}
              />
            )}
          </div>
        </div>
      </div> : <h4>No spawns, just summons</h4>}
    </div>
  )
}

export default LocationDetail;