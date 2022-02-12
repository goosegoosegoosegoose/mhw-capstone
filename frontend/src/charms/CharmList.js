import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
import UserContext from "../auth/userContext";
import { Button } from "react-bootstrap";
import ToggleButton from "../common/ToggleButton";

const CharmList = ({add, remove}) =>{
  const [charms, setCharms] = useState([]);
  const nav = useNavigate();
  const columns = [
    {title:"Name", field:"name", filtering:false, width:"20%"},
    {title:"Level", field:"level", searhable:false, width:"33%",
      lookup:{
        1:1,
        2:3,
        3:3,
        4:4,
        5:5
      }
    },
    {title:"Rarity", field:"rarity", searchable:false, width:"33%",
      lookup:{
        1:1,
        2:2,
        3:3,
        4:4,
        5:5,
        6:6,
        7:7,
        8:8,
        9:9,
        10:10,
        11:11,
        12:12
      }
    }
  ];

  useEffect(function fetchCharmsWhenMounted() {
    async function fetchCharms() {
      const res = await MhwApi.request("charms");
      setCharms(res)
    }
    fetchCharms()
  }, []);

  if (!charms.length === 0) {
    return (
      <div className="container text-center">
        <p>Loading</p>
      </div>
    )
  }

  return (
    <div className="container">
      <MaterialTable
        title="Charms"
        columns={columns} 
        data={charms}
        onRowClick={(event, data) => {
          nav(`/charms/${data.id}`)
        }}
        actions={[
          rowData => ({
            icon:()=><ToggleButton id={rowData.id} type="charms" spacing="my-1 mt-auto" add={add} remove={remove}/>,
            onClick:()=>{}
          })
        ]}
        options={{
          pageSize:10,
          search:true,
          filtering:true,
          tableLayout: "fixed",
          actionsColumnIndex:-1,
          actionsCellStyle: {    
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }
        }}
        localization={{
          header: {
            actions: 'Have?'
          }
        }}
      />
    </div>
  )
}

export default CharmList;