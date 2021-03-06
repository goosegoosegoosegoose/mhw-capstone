import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
import { ThemeProvider, createTheme } from "@material-ui/core";
import PlusButton from "../common/PlusButton";
import MinusButton from "../common/MinusButton";
import DecoCounter from "../common/DecoCounter";

const DecorationList = ({plus, minus}) => {
  const [decos, setDecos] = useState([]);
  const nav = useNavigate();
  const columns = [
    {title:"Name", field:"name", filtering:false},
    {title:"Slot", field:"slot", searchable:false,
      lookup:{
        1:1,
        2:2,
        3:3,
        4:4
      }
    },
    {title:"Rarity", field:"rarity", searchable:false,
      lookup:{
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

  useEffect(function fetchDecosWhenMounted() {
    async function fetchDecos() {
      const res = await MhwApi.request("decorations");
      setDecos(res)
    }
    fetchDecos()
  }, []);

  if (!decos.length === 0) {
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
          title="Decorations"
          columns={columns} 
          data={decos}
          onRowClick={(event, data) => {
            nav(`/decorations/${data.id}`)
          }}
          actions={[{
            icon: "DecoActions"
          }]}
          components ={{
            Action: rowData =>
              <div className="d-flex justify-content-center">
                <DecoCounter id={rowData.data.id}  c="mx-2 my-auto"/>
                <PlusButton id={rowData.data.id}  spacing="mx-1 me-auto" plus={plus} />
                <MinusButton id={rowData.data.id} spacing="mx-1 me-auto" minus={minus} />
              </div>
          }}
          options={{
            pageSize:10,
            search:true,
            filtering:true
          }}
          localization={{
            header: {
              actions: 'Amount in Inventory'
            }
          }}
        />
      </ThemeProvider>
    </div>
  )
}

export default DecorationList;