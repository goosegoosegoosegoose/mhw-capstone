import React, {useState, useEffect} from "react";
import MhwApi from "../api";
import MonsterCard from "./MonsterCard";
import SearchForm from "../common/SearchForm";

const MonsterList = () => {
  const [monsters, setMonsters] = useState([]);

  useEffect(function fetchMonstersWhenMounted () {
    async function fetchMonsters() {
      const res = await MhwApi.request("monsters");
      setMonsters(res);
    }
    fetchMonsters();
  }, []);

  const handleClick = async (evt) => {
    const res = await MhwApi.search("monsters", evt.target.dataset.header, evt.target.dataset.handle);
    getMonsters(res);
  }

  const getMonsters = (res) => {
    setMonsters([...res])
  };

  if (monsters.length === 0) {
    return (
      <div className="container text-center">
        <SearchForm type="monsters" header="name" get={getMonsters} />
        <p>Sorry, no results were found!</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <SearchForm type="monsters" header="name" get={getMonsters} />
      <div className="row justify-content-center">
        {monsters.map(m => 
          <MonsterCard
            key={m.id}
            id={m.id}
            name={m.name}
          />
        )}
      </div>
    </div>
  )
};


export default MonsterList;