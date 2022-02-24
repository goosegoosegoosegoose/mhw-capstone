import React, {useState, useEffect} from "react";
import MhwApi from "../api";
import ArmorCard from "./ArmorCard";
import SearchForm from "../common/SearchForm";
import { Button } from "react-bootstrap"

const ArmorList = ({add, remove}) => {
  const [armor, setArmor] = useState([]);

  useEffect(function fetchArmorWhenMounted () {
    async function fetchArmor() {
      const res = await MhwApi.request("armor");
      setArmor(res)
    }
    fetchArmor()
  }, []);

  const handleClick = async (evt) => {
    const res = await MhwApi.search("armor", evt.target.dataset.header, evt.target.dataset.handle);
    getArmor(res);
  }

  const getArmor = (res) => {
    setArmor([...res])
  }

  const filters = (
    <div>
      <div>
        Type: 
        <Button className="m-1" data-header="type" data-handle="head" type="button" variant="dark" size="sm" onClick={handleClick}>Head</Button>
        <Button className="m-1" data-header="type" data-handle="chest" type="button" variant="dark" size="sm" onClick={handleClick}>Chest</Button>
        <Button className="m-1" data-header="type" data-handle="gloves" type="button" variant="dark" size="sm" onClick={handleClick}>Gloves</Button>
        <Button className="m-1" data-header="type" data-handle="waist" type="button" variant="dark" size="sm" onClick={handleClick}>Waist</Button>
        <Button className="m-1" data-header="type" data-handle="legs" type="button" variant="dark" size="sm" onClick={handleClick}>Legs</Button>
      </div>
      <div>
        Rank: 
        <Button className="m-1" data-header="rank" data-handle="low" type="button" variant="dark" size="sm" onClick={handleClick}>Low</Button>
        <Button className="m-1" data-header="rank" data-handle="high" type="button" variant="dark" size="sm" onClick={handleClick}>High</Button>
        <Button className="m-1" data-header="rank" data-handle="master" type="button" variant="dark" size="sm" onClick={handleClick}>Master</Button>
      </div>
      <div>
        Rarity: 
        <Button className="m-1" data-header="rarity" data-handle="1" type="button" variant="dark" size="sm" onClick={handleClick}>1</Button>
        <Button className="m-1" data-header="rarity" data-handle="2" type="button" variant="dark" size="sm" onClick={handleClick}>2</Button>
        <Button className="m-1" data-header="rarity" data-handle="3" type="button" variant="dark" size="sm" onClick={handleClick}>3</Button>
        <Button className="m-1" data-header="rarity" data-handle="4" type="button" variant="dark" size="sm" onClick={handleClick}>4</Button>
        <Button className="m-1" data-header="rarity" data-handle="5" type="button" variant="dark" size="sm" onClick={handleClick}>5</Button>
        <Button className="m-1" data-header="rarity" data-handle="6" type="button" variant="dark" size="sm" onClick={handleClick}>6</Button>
        <Button className="m-1" data-header="rarity" data-handle="7" type="button" variant="dark" size="sm" onClick={handleClick}>7</Button>
        <Button className="m-1" data-header="rarity" data-handle="8" type="button" variant="dark" size="sm" onClick={handleClick}>8</Button>
        <Button className="m-1" data-header="rarity" data-handle="9" type="button" variant="dark" size="sm" onClick={handleClick}>9</Button>
        <Button className="m-1" data-header="rarity" data-handle="10" type="button" variant="dark" size="sm" onClick={handleClick}>10</Button>
        <Button className="m-1" data-header="rarity" data-handle="11" type="button" variant="dark" size="sm" onClick={handleClick}>11</Button>
        <Button className="m-1" data-header="rarity" data-handle="12" type="button" variant="dark" size="sm" onClick={handleClick}>12</Button>
      </div> 
    </div>
  )

  if (armor.length === 0) {
    return (
      <div className="container text-center">
        <h1>Armor</h1>        
        <SearchForm type="armor" header="name" get={getArmor} />
        {filters}
        <p>Sorry, no results were found! Please re-submit to refresh.</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <h1>Armor</h1>
      <SearchForm type="armor" header="name" get={getArmor} />
      {filters}
      <div className="row justify-content-center">
        {armor.map(a => 
          <ArmorCard
            key={a.id}
            id={a.id}
            name={a.name}
            mImg={a.m_img}
            fImg={a.f_img}
            add={add}
            remove={remove}
          />
        )}
      </div>
    </div>
  )
};

export default ArmorList;