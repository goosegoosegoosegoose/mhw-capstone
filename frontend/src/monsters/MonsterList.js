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

  const getMonsters = (res) => {
    setMonsters([...res])
  };

  if (monsters.length === 0) {
    return (
      <div className="container text-center">
        <SearchForm type="monsters" header="q" get={getMonsters} />
        <p>Sorry, no results were found!</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <SearchForm type="monsters" header="q" get={getMonsters} />
      {monsters.map(monster => 
        <MonsterCard
          key={monster.id}
          id={monster.id}
          name={monster.name}
          type={monster.type}
        />
      )}
    </div>
  )
};


export default MonsterList;