import React, {useState, useEffect} from "react";
import MhwApi from "../api";
import WeaponCard from "./WeaponCard";
import SearchForm from "../common/SearchForm";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const WeaponList = ({add, remove}) => {
  const [weapons, setWeapons] = useState([]);
  const { type } = useParams();

  useEffect(function fetchWeaponsWhenMounted () {
    async function fetchWeapons() {
      const res = await MhwApi.request(`weapons/${type}`);
      setWeapons(res)
    }
    fetchWeapons()
  }, []);

  const handleClick = async (evt) => {
    const res = await MhwApi.search(`weapons/${type}`, evt.target.dataset.header, evt.target.dataset.handle);
    getWeapons(res);
  }

  const getWeapons = (res) => {
    setWeapons([...res])
  }

  const filters = (
    <div>
    {type === "bow" ?         
      <div>
        Coating Available:
        <Button className="m-1" data-header="coatings" data-handle="close range" type="button" variant="primary" size="sm" onClick={handleClick}>Close Range</Button>
        <Button className="m-1" data-header="coatings" data-handle="power" type="button" variant="primary" size="sm" onClick={handleClick}>Power</Button>
        <Button className="m-1" data-header="coatings" data-handle="paralysis" type="button" variant="primary" size="sm" onClick={handleClick}>Paralysis</Button>
        <Button className="m-1" data-header="coatings" data-handle="poison" type="button" variant="primary" size="sm" onClick={handleClick}>Poison</Button>
        <Button className="m-1" data-header="coatings" data-handle="sleep" type="button" variant="primary" size="sm" onClick={handleClick}>Sleep</Button>
        <Button className="m-1" data-header="coatings" data-handle="blast" type="button" variant="primary" size="sm" onClick={handleClick}>Blast</Button>
      </div>
    : null}
    {type === "charge-blade" ?         
      <div>
        Phial Type:
        <Button className="m-1" data-header="phial_type" data-handle="impact" type="button" variant="primary" size="sm" onClick={handleClick}>Impact</Button>
        <Button className="m-1" data-header="phial_type" data-handle="power element" type="button" variant="primary" size="sm" onClick={handleClick}>Power Element</Button>
      </div>
    : null}
    {type === "switch-axe" ?         
      <div>
        Phial Type:
        <Button className="m-1" data-header="phial_type" data-handle="power" type="button" variant="primary" size="sm" onClick={handleClick}>Power</Button>
        <Button className="m-1" data-header="phial_type" data-handle="power element" type="button" variant="primary" size="sm" onClick={handleClick}>Power Element</Button>
        <Button className="m-1" data-header="phial_type" data-handle="dragon" type="button" variant="primary" size="sm" onClick={handleClick}>Dragon</Button>
        <Button className="m-1" data-header="phial_type" data-handle="exhaust" type="button" variant="primary" size="sm" onClick={handleClick}>Exhaust</Button>
        <Button className="m-1" data-header="phial_type" data-handle="para" type="button" variant="primary" size="sm" onClick={handleClick}>Paralysis</Button>
        <Button className="m-1" data-header="phial_type" data-handle="poison" type="button" variant="primary" size="sm" onClick={handleClick}>Poison</Button>
      </div>
    : null}
    {type === "gunlance" ?         
      <div>
        Shelling type:
        <Button className="m-1" data-header="shelling_type" data-handle="long" type="button" variant="primary" size="sm" onClick={handleClick}>Long</Button>
        <Button className="m-1" data-header="shelling_type" data-handle="normal" type="button" variant="primary" size="sm" onClick={handleClick}>Normal</Button>
        <Button className="m-1" data-header="shelling_type" data-handle="wide" type="button" variant="primary" size="sm" onClick={handleClick}>Wide</Button>
      </div>
    : null}
    {type === "insect-glaive" ?         
      <div>
        Boost Type:
        <Button className="m-1" data-header="boost_type" data-handle="sever" type="button" variant="primary" size="sm" onClick={handleClick}>Sever</Button>
        <Button className="m-1" data-header="boost_type" data-handle="speed" type="button" variant="primary" size="sm" onClick={handleClick}>Speed</Button>
        <Button className="m-1" data-header="boost_type" data-handle="element" type="button" variant="primary" size="sm" onClick={handleClick}>Element</Button>
        <Button className="m-1" data-header="boost_type" data-handle="health" type="button" variant="primary" size="sm" onClick={handleClick}>Health</Button>
        <Button className="m-1" data-header="boost_type" data-handle="stamina" type="button" variant="primary" size="sm" onClick={handleClick}>Stamina</Button>
        <Button className="m-1" data-header="boost_type" data-handle="blunt" type="button" variant="primary" size="sm" onClick={handleClick}>Blunt</Button>
      </div>
    : null}
    {type === "heavy-bowgun" || type === "light-bowgun" ?
      <>      
        <div>
          Special Ammo:
          <Button className="m-1" data-header="special_ammo" data-handle="wyvernheart" type="button" variant="primary" size="sm" onClick={handleClick}>Wyverheart</Button>
          <Button className="m-1" data-header="special_ammo" data-handle="wyvernsnipe" type="button" variant="primary" size="sm" onClick={handleClick}>Wyvernsnipe</Button>
          <Button className="m-1" data-header="special_ammo" data-handle="wyvernblast" type="button" variant="primary" size="sm" onClick={handleClick}>Wyvernblast</Button>
        </div>
        <div>
          Deviation:
          <Button className="m-1" data-header="deviation" data-handle="none" type="button" variant="primary" size="sm" onClick={handleClick}>None</Button>
          <Button className="m-1" data-header="deviation" data-handle="low" type="button" variant="primary" size="sm" onClick={handleClick}>Low</Button>
          <Button className="m-1" data-header="deviation" data-handle="average" type="button" variant="primary" size="sm" onClick={handleClick}>Average</Button>
          <Button className="m-1" data-header="deviation" data-handle="high" type="button" variant="primary" size="sm" onClick={handleClick}>High</Button>
        </div>
        <div>
          Ammo Available:
          <Button className="m-1" data-header="ammo_type" data-handle="normal" type="button" variant="primary" size="sm" onClick={handleClick}>Normal</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="piercing" type="button" variant="primary" size="sm" onClick={handleClick}>Piercing</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="spread" type="button" variant="primary" size="sm" onClick={handleClick}>Spread</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="sticky" type="button" variant="primary" size="sm" onClick={handleClick}>Sticky</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="cluster" type="button" variant="primary" size="sm" onClick={handleClick}>Cluster</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="recover" type="button" variant="primary" size="sm" onClick={handleClick}>Recover</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="poison" type="button" variant="primary" size="sm" onClick={handleClick}>Poison</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="paralysis" type="button" variant="primary" size="sm" onClick={handleClick}>Paralysis</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="sleep" type="button" variant="primary" size="sm" onClick={handleClick}>Sleep</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="exhaust" type="button" variant="primary" size="sm" onClick={handleClick}>Exhaust</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="flaming" type="button" variant="primary" size="sm" onClick={handleClick}>Flaming</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="water" type="button" variant="primary" size="sm" onClick={handleClick}>Water</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="freeze" type="button" variant="primary" size="sm" onClick={handleClick}>Freeze</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="thunder" type="button" variant="primary" size="sm" onClick={handleClick}>Thunder</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="dragon" type="button" variant="primary" size="sm" onClick={handleClick}>Dragon</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="slicing" type="button" variant="primary" size="sm" onClick={handleClick}>Slicing</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="wyvern" type="button" variant="primary" size="sm" onClick={handleClick}>Wyvern</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="demon" type="button" variant="primary" size="sm" onClick={handleClick}>Demon</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="armor" type="button" variant="primary" size="sm" onClick={handleClick}>Armor</Button>
          <Button className="m-1" data-header="ammo_type" data-handle="tranq" type="button" variant="primary" size="sm" onClick={handleClick}>Tranq</Button>
        </div>
      </>
    : null}
    {type !== "heavy-bowgun" && type !== "light-bowgun" ?
      <div>
        Elderseal: 
        <Button className="m-1" data-header="elderseal" data-handle="low" type="button" variant="primary" size="sm" onClick={handleClick}>Low</Button>
        <Button className="m-1" data-header="elderseal" data-handle="high" type="button" variant="primary" size="sm" onClick={handleClick}>High</Button>
      </div>
    : null}
    <div>
      Rarity: 
      <Button className="m-1" data-header="rarity" data-handle="1" type="button" variant="primary" size="sm" onClick={handleClick}>1</Button>
      <Button className="m-1" data-header="rarity" data-handle="2" type="button" variant="primary" size="sm" onClick={handleClick}>2</Button>
      <Button className="m-1" data-header="rarity" data-handle="3" type="button" variant="primary" size="sm" onClick={handleClick}>3</Button>
      <Button className="m-1" data-header="rarity" data-handle="4" type="button" variant="primary" size="sm" onClick={handleClick}>4</Button>
      <Button className="m-1" data-header="rarity" data-handle="5" type="button" variant="primary" size="sm" onClick={handleClick}>5</Button>
      <Button className="m-1" data-header="rarity" data-handle="6" type="button" variant="primary" size="sm" onClick={handleClick}>6</Button>
      <Button className="m-1" data-header="rarity" data-handle="7" type="button" variant="primary" size="sm" onClick={handleClick}>7</Button>
      <Button className="m-1" data-header="rarity" data-handle="8" type="button" variant="primary" size="sm" onClick={handleClick}>8</Button>
      </div> 
    </div>
  );

  if (weapons.length === 0) {
    return (
      <div className="container text-center">
        <SearchForm type={`weapons/${type}`} header="name" get={getWeapons} />
        {filters}
        <p className="mt-5">Sorry, no results were found! Resubmit to refresh.</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <SearchForm type={`weapons/${type}`} header="name" get={getWeapons} />
      {filters}
      <div className="row justify-content-center">
        {weapons.map(w => 
          <WeaponCard
            key={w.id}
            id={w.id}
            name={w.name}
            img={w.img}
            add={add}
            remove={remove}
          />
        )}
      </div>
    </div>
  )
};

export default WeaponList;