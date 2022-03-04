import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
import { ThemeProvider, createTheme } from "@material-ui/core";
import ToggleButton from "../common/ToggleButton";

const WeaponDetail = ({add, remove}) => {
  const [weapon, setWeapon] = useState({});
  const { id } = useParams();
  let count = 0;
  let a = {sharpness: []};
  if (weapon.white_sharpness) {
    weapon.white_sharpness.map((s,i) => {
      a.sharpness.push({"handicraft": i, "sharpness": s})
    })
  };
  const sharpColumns = [
    {title:"Handicraft Level", field:"handicraft", width:"10%"},
    {title:"White Sharpness Value", field:"sharpness", width:"10%"},
  ]
  const ammoColumns = [
    {title: "Type", field:"ammo_type", width:"15%"},
    {title:"Capacity with Boost 1", field:"ammo_capacity[0]", width:"10%", searchable:false},
    {title:"Capacity with Boost 2", field:"ammo_capacity[1]", width:"10%", searchable:false},
    {title:"Capacity with Boost 3", field:"ammo_capacity[2]", width:"10%", searchable:false},
  ]
  const matColumns = [
    {title:"Material", field:"material", width:"15%"},
    {title:"Quantity", field:"quantity", width:"10%"},
    {title:"Description", field:"description"},
  ];
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });

  useEffect(function fetchWeaponWhenMounted () {
    async function fetchWeapon() {
      const res = await MhwApi.getOne("weapons/w", id);
      setWeapon(res);
    }
    fetchWeapon();
  }, []);

  if (!weapon.elements) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <div className="container">
      <img src={weapon.img} />
      <div className="row">
        <div className="col-sm-12 d-flex">
          <h1 className="my-1">{weapon.name}</h1>
          <ToggleButton id={Number(id)} type="weapons" spacing="m-3" add={add} remove={remove} label1="Crafted" label2="Craft"/>
        </div>
      </div>
      <p>{weapon.attack} attack.</p>
      <p>{weapon.affinity}% affinity (crit).</p>
      {weapon.elements ?
        weapon.elements.length > 0 ?
          <p>Does {weapon.elements.map(e => {
            count++;
            if (count === weapon.elements.length) {
              return <span key={e.element}>{e.damage} <Link to={`/elements/${e.element}`}>{e.element}</Link> damage.</span>
            }
            return <span key={e.element}>{e.damage} <Link to={`/elements/${e.element}`}>{e.element}</Link> damage and </span>
          })}</p>
        :null
      : null}
      {weapon.coatings ?
        weapon.coatings.length > 0 ? 
          <p>Can use the {weapon.coatings.map(c => {
            count++;
            if (count === 1) return <span key={c}>{c}</span>
            if (count === weapon.coatings.length) {
              return <span key={c}>, and {c} types of coatings.</span>
            }
            return <span key={c}>, {c}</span>
          })}</p>
        : null
      :null}
      {weapon.phial_type ? 
        <p>Uses {weapon.phial_type} phials{weapon.phial_damage ? <span> which do {weapon.phial_damage} damage.</span> : <span>.</span>}</p>
      : null}
      {weapon.shelling_type ? 
        <p>Uses level {weapon.shelling_level} {weapon.shelling_type} shells.</p>
      : null}
      {weapon.boost_type ? 
        <p>Kinsect gets a {weapon.boost_type} boost.</p>
      : null}
      {weapon.special_ammo ? 
        <p>Uses {weapon.special_ammo} special ammo.</p>
      : null}
      {weapon.deviation ? 
        <p>Has a {weapon.deviation} level of deviation.</p>
      : null}
      {weapon.defense > 0 ? <p>Gives an additional {weapon.defense} defense</p> : null}
      <p>Rarity level {weapon.rarity}.</p>
      {Object.keys(weapon.slots).length > 0 ?
        <p>
          Slots: | {Object.entries(weapon.slots).map(([key, value]) => {
            return ` ${value} level ${key} slots |`
          })}
        </p>
      : null}
      <ThemeProvider theme={theme}>
        {weapon.white_sharpness ? 
          <div className="row m-4">
            <p><b>*Sharpness is influenced by the <Link to="/skills/142">Handicraft</Link> skill up to level 5.</b></p>
            <MaterialTable
              title = "White Sharpness"
              columns={sharpColumns} 
              data={a.sharpness}
              options={{
                paging:false,
                search:false,
                filtering:false
              }}
            />
          </div> 
        : null}
        {weapon.ammo ? 
          <div className="row m-4">
            <p><b>*Capacities are influenced by the <Link to="/skills/187">Capacity Boost</Link> skill.</b></p>
            <MaterialTable
              title = "Ammo Types"
              columns={ammoColumns} 
              data={weapon.ammo}
              options={{
                paging:false,
                search:false,
                filtering:false
              }}
            />
          </div> 
        : null}
        {weapon.materials.length > 0 ? 
          <div className="row m-4">
            <MaterialTable
              title="Crafting Materials"
              columns={matColumns} 
              data={weapon.materials}
              options={{
                paging:false,
                search:false,
                filtering:false
              }}
            />
          </div> 
        : null}
      </ThemeProvider>
    </div>
  )
}

export default WeaponDetail;