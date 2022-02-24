import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
import { ThemeProvider, createTheme } from "@material-ui/core";

const SkillList = () => {
  const [skills, setSkills] = useState([]);
  const nav = useNavigate();
  const columns = [
    {title:"Name", field:"name", filtering:false, width:"20%"},
    {title:"Level", field:"level", searhable:false, width:"10%",
      lookup:{
        1:1,
        2:2,
        3:3
      }
    },
    {title:"Description", field:"description", searchable:false}
  ];
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });

  useEffect(function fetchSkillsWhenMounted() {
    async function fetchSkills() {
      const res = await MhwApi.request("skills");
      setSkills(res)
    }
    fetchSkills()
  }, []);

  if (!skills.length === 0) {
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
          title="Skill Levels"
          columns={columns} 
          data={skills}
          onRowClick={(event, data) => {
            nav(`/skills/${data.id}`)
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

export default SkillList;