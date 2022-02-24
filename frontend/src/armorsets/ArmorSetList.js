import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
import { ThemeProvider, createTheme } from "@material-ui/core";

const ArmorSetList = () =>{
  const [armorSets, setArmorSets] = useState([]);
  const nav = useNavigate();
  const columns = [
    {title:"Name", field:"name", filtering:false},
    {title:"Rank", field:"rank", searhable:false, width:"10%",
      lookup: {
        low: "Low",
        high: "High",
        master: "Master"
      }
    },
    {title:"Set Bonus", field:"set_bonus", searchable:false},
    {title:"Base Defense", field:"total_base"},
    {title:"Max Upgraded Defense", field:"total_max"},
    {title:"Augmented Defense", field:"total_augmented"}
  ];
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });


  useEffect(function fetchArmorSetsWhenMounted() {
    async function fetchArmorSets() {
      const res = await MhwApi.request("armorsets");
      setArmorSets(res)
    }
    fetchArmorSets()
  }, []);

  if (!armorSets.length === 0) {
    return (
      <div className="container text-center">
        <p>Loading</p>
      </div>
    )
  }

  return (
    <div className="container">
      <ThemeProvider theme={theme}>
        <MaterialTable
          title="Armor Sets" 
          columns={columns} 
          data={armorSets}
          onRowClick={(event, data) => {
            nav(`/armor-sets/${data.id}`)
          }}
          options={{
            pageSize:10,
            search:true,
            filtering:true,
            tableLayout:"fixed"
          }}
        />
      </ThemeProvider>
    </div>
  )
}

export default ArmorSetList;