import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from "@material-table/core";
import { ThemeProvider, createTheme } from "@material-ui/core";
import ToggleButton from "../common/ToggleButton";

const ElementDetail = ({add, remove}) => {
  const [element, setElement] = useState({});
  const { ele } = useParams();
  const nav = useNavigate();
  const wep_columns = [
    {title:"Name", field:"name", filtering:false},
    {title:"Type", field:"type", searhable:false, 
      lookup:{
        [`great-sword`]: "Great Sword",
        [`long-sword`]: "Long Sword",
        [`sword-and-shield`]: "Sword and Shield",
        [`dual-blades`]: "Dual Blades",
        hammer: "Hammer",
        [`hunting-horn`]: "Hunting Horn",
        lance: "Lance",
        gunlance: "Gunlance",
        [`switch-axe`]: "Switch Axe",
        [`charge-blade`]: "Charge Blade",
        [`insect-glaive`]: "Insect Glaive",
        [`light-bowgun`]: "Light Bowgun",
        [`heavy-bowgun`]: "Heavy Bowgun",
        bow: "Bow"
      }
    },
    {title:"Base Attack Value (Raw)", field:"attack", searhable:false},
    {title:"Affinity (Crit%)", field:"affinity", searhable:false},
    {title:"Rarity", field:"rarity", searchable:false,       
      lookup:{
        1:1,
        2:3,
        3:3,
        4:4,
        5:5,
        6:6,
        7:7,
        8:8
      }
    }
  ];
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });

  useEffect(function fetchElementWhenMounted() {
    async function fetchElement() {
      const res = await MhwApi.getOne("elements", ele);
      setElement(res)
    }
    fetchElement()
  }, []);

  if (!element.weapons) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <div className="container">
      <h1 className="m-4">{element.element} element</h1>
      <div className="container">
        <ThemeProvider theme={theme}>
          <MaterialTable 
            title={`Weapons with ${element.element} damage`}
            columns={wep_columns} 
            data={element.weapons}
            onRowClick={(event, data) => {
              nav(`/weapons/w/${data.id}`)
            }}
            actions={[
              {
                icon: "ToggleButton"
              }
            ]}
            components ={{
              Action: rowData =>
                <div className="d-flex justify-content-center">
                  <ToggleButton id={rowData.data.id} type="weapons" spacing="mx-3" add={add} remove={remove} label1="Crafted" label2="Craft"/>
                </div>
            }}
            options={{
              pageSize:10,
              search:true,
              filtering:true
            }}
            localization={{
              header: {
                actions: 'Crafted?'
              }
            }}
          />
        </ThemeProvider>
      </div>
    </div>
  )
}

export default ElementDetail;