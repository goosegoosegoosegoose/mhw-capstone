import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from "@material-table/core";
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
      <h1 className="m-4">{element.element.toUpperCase()} element</h1>
      <div className="container">
        <MaterialTable 
          title={`Weapons with ${element.element} damage`}
          columns={wep_columns} 
          data={element.weapons}
          onRowClick={(event, data) => {
            nav(`/weapons/w/${data.id}`)
          }}
          actions={[
            rowData => ({
              icon:()=><ToggleButton id={Number(rowData.id)} type="weapons" spacing="mx-3 my-3" add={add} remove={remove} label1="Sell?" label2="Craft?"/>,
              onClick:()=>{}
            })
          ]}
          options={{
            pageSize:10,
            search:true,
            filtering:true
          }}
          localization={{
            header: {
              actions: 'Have?'
            }
          }}
        />
      </div>
    </div>
  )
}

export default ElementDetail;