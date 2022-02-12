import React, {useState, useEffect} from "react";
import MhwApi from "../api";
import LocationCard from "./LocationCard";
import SearchForm from "../common/SearchForm";
import { Container, Button } from "react-bootstrap"

const LocationList = () => {
  const [locations, setLocations] = useState([]);

  useEffect(function fetchLocationsWhenMounted() {
    async function fetchLocations() {
      const res = await MhwApi.request("locations");
      setLocations(res)
    }
    fetchLocations()
  }, []);

  const getLocations = (res) => {
    setLocations([...res])
  }

  if (locations.length === 0) {
    return (
      <div className="container text-center">
        <SearchForm type="locations" header="name" get={getLocations} />
        <p>Sorry, no results were found!</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <SearchForm type="locations" header="name" get={getLocations} />
        <div className="row justify-content-center">
          {locations.map(l => 
            <LocationCard className="col-sm-6"
              key={l.id}
              id={l.id}
              name={l.name}
            />
          )}
        </div>
    </div>
  )
}

export default LocationList;