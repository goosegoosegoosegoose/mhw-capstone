import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
import { ThemeProvider, createTheme } from "@material-ui/core";
import ToggleButton from "../common/ToggleButton";

const CharmList = ({add, remove}) =>{
  const [charms, setCharms] = useState([]);
  const nav = useNavigate();
  const columns = [
    {title:"Name", field:"name", filtering:false},
    {title:"Level", field:"level", searhable:false,
      lookup:{
        1:1,
        2:2,
        3:3,
        4:4,
        5:5
      }
    },
    {title:"Rarity", field:"rarity", searchable:false,
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
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });

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
      <ThemeProvider theme={theme}>
        <MaterialTable
          title="Charms"
          columns={columns} 
          data={charms}
          onRowClick={(event, data) => {
            nav(`/charms/${data.id}`)
          }}
          actions={[{
            icon: "ToggleButton"
          }]}
          components ={{
            Action: rowData =>
              <div className="d-flex justify-content-center">
                <ToggleButton id={rowData.data.id} type="charms" spacing="mx-3" add={add} remove={remove} label1="Crafted" label2="Craft"/>
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
  )
}

export default CharmList;