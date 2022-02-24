import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from "@material-table/core";
import { ThemeProvider, createTheme } from "@material-ui/core";
import ToggleButton from "../common/ToggleButton";

const CharmDetail = ({add, remove}) => {
  const [charm, setCharm] = useState({});
  const { id } = useParams();
  const nav = useNavigate();
  const skillColumns = [
    {title:"Skill", field:"name", width:"15%"},
    {title:"Level", field:"level", width:"10%"},
    {title:"Description", field:"description"}
  ];
  const matColumns = [
    {title:"Material", field:"name", width:"15%"},
    {title:"Quantity", field:"quantity", width:"10%"},
    {title:"Description", field:"description"},
  ];

  useEffect(function fetchCharmWhenMounted () {
    async function fetchCharm() {
      const res = await MhwApi.getOne("charms", id);
      setCharm(res);
    }
    fetchCharm();
  }, []);
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });

  if (!charm.materials) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="container">
      <div className="col-sm-12 d-flex">
        <h1 className="m-3">{charm.name}</h1>
        <ToggleButton id={Number(id)} type="charms" spacing="mx-1 my-4" add={add} remove={remove} label1="Sell?" label2="Craft?"/>
      </div>
      <ThemeProvider theme={theme}>
        <div className="container my-5">
          <div className="mb-4">
          <MaterialTable
            title="Skills"
            columns={skillColumns} 
            data={charm.skills}
            onRowClick={(event, data) => {
              nav(`/skills/${data.id}`)
            }}
            options={{
              pageSize:3,
              search:false,
              filtering:false,
              tableLayout:"fixed"
            }}
          />
          </div>
          <MaterialTable
            title="Materials needed to craft"
            columns={matColumns} 
            data={charm.materials}
            options={{
              pageSize:5,
              search:false,
              filtering:false,
              tableLayout:"fixed"
            }}
          />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default CharmDetail;