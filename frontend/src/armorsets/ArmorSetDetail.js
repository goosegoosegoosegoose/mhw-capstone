import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from "@material-table/core";
import ArmorCard from "../armor/ArmorCard";

const ArmorSetDetail = ({add, remove}) => {
  const [armorSet, setArmorSet] = useState({});
  const { id } = useParams();
  const skill_columns = [
    {title:"Skill", field:"name", width:"15%"},
    {title:"Level", field:"level", width:"7%"},
    {title:"Description", field:"description"}
  ];

  useEffect(function fetchArmorSetWhenMounted () {
    async function fetchArmorSet() {
      const res = await MhwApi.getOne("armorsets", id);
      setArmorSet(res);
    }
    fetchArmorSet();
  }, []);

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
          <div className="container my-2">
            <MaterialTable
              title="Skills"
              columns={skill_columns} 
              data={armorSet.skills}
              options={{
                pageSize:3,
                search:false,
                filtering:false,
                tableLayout:"fixed"
              }}
            />
          </div> 
        : <h4 className="mt-5">No skills</h4>}
      </div>
    </div>
  )
}

export default ArmorSetDetail;