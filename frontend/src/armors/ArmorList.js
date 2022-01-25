import React, {useState, useEffect} from "react";
import MhwApi from "../api";
import ArmorCard from "./ArmorCard";
import SearchForm from "../common/SearchForm";

const ArmorList = ({add, remove}) => {
  const [armors, setArmors] = useState([]);

  useEffect(function fetchArmorsWhenMounted () {
    async function fetchArmors() {
      const res = await MhwApi.request("armors")
      setArmors(res)
    }
    fetchArmors();
  }, []);

  const getArmors = (res) => {
    setArmors([...res])
  };

  if (armors.length === 0) {
    return (
      <div className="container text-center">
        <SearchForm type="armors" header="q" get={getArmors} />
        <p>Sorry, no results were found!</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <SearchForm type="armors" header="q" get={getArmors} />
      {armors.map(armor => 
        <ArmorCard
          key={armor.id}
          id={armor.id}
          name={armor.name}
          add={add}
          remove={remove}
        />
      )}
    </div>
  )
};


export default ArmorList;