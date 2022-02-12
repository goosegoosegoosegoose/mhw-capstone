import React, { useContext, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import UserContext from "../auth/userContext";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
import ToggleButton from "../common/ToggleButton";

const ArmorDetail = ({add, remove}) => {
  const [armor, setArmor] = useState({});
  const { id } = useParams();
  const mat_columns = [
    {title:"Material", field:"material", width:"15%"},
    {title:"Quantity", field:"quantity", width:"10%"},
    {title:"Description", field:"description"},
  ];

  useEffect(function fetchArmorWhenMounted () {
    async function fetchArmor() {
      const res = await MhwApi.getOne("armor", id);
      setArmor(res);
    }
    fetchArmor();
  }, []);

  if (!armor.set) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <div className="container">
      <img src={armor.m_img} />
      <img src={armor.f_img} />
      <div className="row">
        <div className="col-sm-12 d-flex">
          <h1 className="my-1">{armor.name}</h1>
          <ToggleButton id={Number(id)} type="armor" spacing="mx-3 my-3" add={add} remove={remove}/>
        </div>
      </div>
      <p>Base defense value is {armor.defense}</p>
      <p>Part of the {armor.set.name} Set</p>
      <p>Rank: {armor.rank}</p>
      <p>Rarity: {armor.rarity}</p>
      {Object.keys(armor.slots).length > 0 ?
        <p>
          Slots: | {Object.entries(armor.slots).map(([key, value]) => {
            return ` Level ${value} |`
          })}
        </p>
      : null}
      {armor.materials.length > 0 ? 
        <div>
          <MaterialTable
            title="Crafting Materials"
            columns={mat_columns} 
            data={armor.materials}
            options={{
              pageSize:5,
              search:false,
              filtering:false
            }}
          />
        </div> 
      : null}
      
    </div>
  )
}

export default ArmorDetail;