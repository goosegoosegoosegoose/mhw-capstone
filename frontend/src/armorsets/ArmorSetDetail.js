import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from "@material-table/core";
import { ThemeProvider, createTheme } from "@material-ui/core";
import ArmorCard from "../armor/ArmorCard";

const ArmorSetDetail = ({add, remove}) => {
  const [armorSet, setArmorSet] = useState({});
  const { id } = useParams();
  const nav = useNavigate();
  const skillColumns = [
    {title:"Skill", field:"name", width:"15%"},
    {title:"Level", field:"level", width:"7%"},
    {title:"Description", field:"description"}
  ];
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });

  useEffect(function fetchArmorSetWhenMounted () {
    async function fetchArmorSet() {
      const res = await MhwApi.getOne("armorsets", id);
      setArmorSet(res);
    }
    fetchArmorSet();
  }, [id]);

  if (!armorSet.armor) {
    return (
      <div>Loading</div>
    )
  }

  return (    
    <div className="container">
      <h1 className="mt-3 ms-1 me-1 mb-1">{armorSet.name} Set</h1>
      <p className="m-1 mt-3">Total base defense is {armorSet.total_base}.</p>
      <p className="m-1 mt-3">Total upgraded defense is {armorSet.total_max}.</p>
      <p className="m-1 mt-3">Total augmented defense is {armorSet.total_augmented}.</p>
      <div className="text-center my-2">
        <div className="row justify-content-center">
          <h4>Pieces</h4>
          {armorSet.armor.map(a => 
            <ArmorCard
              key={a.id}
              id={a.id}
              name={a.name}
              mImg={a.m_img}
              fImg={a.f_img}
              add={add}
              remove={remove}
            />
          )}
        </div>
          {armorSet.skills.length > 0 ? 
            <div className="m-4">
              <ThemeProvider theme={theme}>
                <MaterialTable
                  title="Skills"
                  columns={skillColumns} 
                  data={armorSet.skills}
                  onRowClick={(event, data) => {
                    nav(`/skills/${data.id}`)
                  }}
                  options={{
                    paging: false,
                    search:false,
                    filtering:false,
                    tableLayout:"fixed"
                  }}
                />
              </ThemeProvider>
            </div> 
          : <h4 className="mt-5">No skills</h4>}

      </div>
    </div>
  )
}

export default ArmorSetDetail;