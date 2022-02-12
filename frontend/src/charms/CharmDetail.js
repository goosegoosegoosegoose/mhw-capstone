import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from "@material-table/core";
import ToggleButton from "../common/ToggleButton";

const CharmDetail = ({add, remove}) => {
  const [charm, setCharm] = useState({});
  const { id } = useParams();
  const nav = useNavigate();
  const skill_columns = [
    {title:"Skill", field:"name", width:"15%"},
    {title:"Level", field:"level", width:"10%"},
    {title:"Description", field:"description"}
  ];
  const mat_columns = [
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

  if (!charm.materials) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="container">
      <div className="col-sm-12 d-flex">
        <h1 className="m-3">{charm.name}</h1>
        <ToggleButton id={Number(id)} type="charms" spacing="mx-1 my-4" add={add} remove={remove}/>
      </div>
      <div className="container my-5">
        <MaterialTable
          title="Skills"
          columns={skill_columns} 
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
      <div className="container my-2">
        <MaterialTable
          title="Materials needed to craft"
          columns={mat_columns} 
          data={charm.materials}
          options={{
            pageSize:5,
            search:false,
            filtering:false,
            tableLayout:"fixed"
          }}
        />
      </div>
    </div>
  )
}

export default CharmDetail;