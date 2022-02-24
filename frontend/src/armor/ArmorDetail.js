import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
import { ThemeProvider, createTheme } from "@material-ui/core";
import ToggleButton from "../common/ToggleButton";

const ArmorDetail = ({add, remove}) => {
  const [armor, setArmor] = useState({});
  const { id } = useParams();
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
      <div className="row d-flex align-items-center">
        <div className="col-sm-6">
          <div className="d-flex my-3">
            <h1 className="my-1">{armor.name}</h1>
            <ToggleButton id={Number(id)} type="armor" spacing="mx-3 my-3" add={add} remove={remove} label1="Sell?" label2="Craft?"/>
          </div>
          <p>Base defense value is {armor.defense_base}.</p>
          <p>Max upgraded defense value is {armor.defense_max}.</p>
          <p>Augmented defense value is {armor.defense_augmented}.</p>
          <p>Part of the <a href={`/armor-sets/${armor.set.id}`}>{armor.set.name}</a> Set.</p>
          <p>Rank: {armor.rank}</p>
          <p>Rarity: {armor.rarity}</p>
          {Object.keys(armor.slots).length > 0 ?
            <p>
              Slots: | {Object.entries(armor.slots).map(([key, value]) => {
                return ` ${value} level ${key} slots |`
              })}
            </p>
          : null}
        </div>
        <div className="col-sm-6">
          <img src={armor.m_img} className="img-fluid" />
          <img src={armor.f_img} className="img-fluid" />
        </div>     
      </div>
      {armor.materials.length > 0 ? 
        <div>
          <ThemeProvider theme={theme}>
            <MaterialTable
              title="Crafting Materials"
              columns={matColumns} 
              data={armor.materials}
              options={{
                pageSize:5,
                search:false,
                filtering:false
              }}
            />
          </ThemeProvider>
        </div> 
          : null} 
      
    </div>
  )
}

export default ArmorDetail;