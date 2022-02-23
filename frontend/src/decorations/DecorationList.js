import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
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
      <MaterialTable
        title="Decorations"
        columns={columns} 
        data={decos}
        onRowClick={(event, data) => {
          nav(`/decorations/${data.id}`)
        }}
        actions={[
          rowData => ({
            icon:()=><DecoCounter id={rowData.id} c="mb-1"/>,
            onClick:()=>{}
          }),
          rowData => ({
            icon:()=><PlusButton id={rowData.id} spacing="my-1 mt-auto" plus={plus} />,
            onClick:()=>{}
          }),
          rowData => ({
            icon:()=><MinusButton id={rowData.id} spacing="my-1 mt-auto" minus={minus} />,
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
            actions: 'Amount in Inventory'
          }
        }}
      />
    </div>
  )
}

export default DecorationList;