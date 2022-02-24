import React, {useState, useEffect} from "react";
import MhwApi from "../api";
import MonsterCard from "./MonsterCard";
import SearchForm from "../common/SearchForm";
import { Button } from "react-bootstrap";

const MonsterList = ({add, remove}) => {
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

  const filters = (
    <div>
      <div>
        Size:
        <Button className="m-1" data-header="type" data-handle="small" type="button" variant="dark" size="sm" onClick={handleClick}>Small</Button>
        <Button className="m-1" data-header="type" data-handle="large" type="button" variant="dark" size="sm" onClick={handleClick}>Large</Button>
      </div>
      <div>
        Species:
        <Button className="m-1" data-header="species" data-handle="bird wyvern" type="button" variant="dark" size="sm" onClick={handleClick}>Bird Wyverns</Button>
        <Button className="m-1" data-header="species" data-handle="brute wyvern" type="button" variant="dark" size="sm" onClick={handleClick}>Brute Wyverns</Button>
        <Button className="m-1" data-header="species" data-handle="fanged wyvern" type="button" variant="dark" size="sm" onClick={handleClick}>Fanged Wyverns</Button>
        <Button className="m-1" data-header="species" data-handle="flying wyvern" type="button" variant="dark" size="sm" onClick={handleClick}>Flying Wyverns</Button>
        <Button className="m-1" data-header="species" data-handle="piscine wyvern" type="button" variant="dark" size="sm" onClick={handleClick}>Piscine Wyverns</Button>
        <Button className="m-1" data-header="species" data-handle="fanged beast" type="button" variant="dark" size="sm" onClick={handleClick}>Fanged Beast</Button>
        <Button className="m-1" data-header="species" data-handle="elder dragon" type="button" variant="dark" size="sm" onClick={handleClick}>Elder Dragons</Button>
        <Button className="m-1" data-header="species" data-handle="relict" type="button" variant="dark" size="sm" onClick={handleClick}>Relicts</Button>
        <Button className="m-1" data-header="species" data-handle="herbivore" type="button" variant="dark" size="sm" onClick={handleClick}>Herbivores</Button>
        <Button className="m-1" data-header="species" data-handle="wingdrake" type="button" variant="dark" size="sm" onClick={handleClick}>Wingdrakes</Button>
        <Button className="m-1" data-header="species" data-handle="neopteron" type="button" variant="dark" size="sm" onClick={handleClick}>Neopterons</Button>
        <Button className="m-1" data-header="species" data-handle="fish" type="button" variant="dark" size="sm" onClick={handleClick}>Fish</Button>
      </div>
    </div>
  )

  if (monsters.length === 0) {
    return (
      <div className="container text-center">
        <h1>Monsters</h1>
        <SearchForm type="monsters" header="name" get={getMonsters} />
        {filters}
        <p>Sorry, no results were found! Please re-submit to refresh.</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <h1>Monsters</h1>
      <SearchForm type="monsters" header="name" get={getMonsters} />
      {filters}
      <div className="row justify-content-center">
        {monsters.map(m => 
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
  )
};


export default MonsterList;