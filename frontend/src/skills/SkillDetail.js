import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import ArmorCard from "../armor/ArmorCard";
import MaterialTable from "@material-table/core";

const SkillDetail = ({add, remove}) => {
  const [skill, setSkill] = useState({});
  const { id } = useParams();
  const nav = useNavigate();
  const set_columns = [
    {title:"Armor Set", field:"name"},
    {title:"Pieces Needed", field:"pieces"}
  ];
  const charm_columns = [
    {title:"Charm", field:"name"},
    {title:"Level", field:"level"},
    {title:"Rarity", field:"rarity"}
  ];
  const deco_columns = [
    {title:"Decoration", field:"name"},
    {title:"Rarity", field:"rarity"},
    {title:"Slot", field:"slot"}
  ];

  useEffect(function fetchSkillWhenMounted() {
    async function fetchSkill() {
      const res = await MhwApi.getOne("skills", id);
      setSkill(res)
    }
    fetchSkill()
  }, []);


  if (!skill.decorations) {
    return (
      <div>Loading...</div>
    )
  }

  return(
    <div className="container">
      <h1 className="m-1">{skill.name}</h1>
      <p className="m-1 mt-3">Skill level {skill.level}.</p>
      <p className="m-1 mt-3">{skill.description}</p>
      {skill.armor.length > 0 ? 
        <div className="text-center my-4">
          <div className="row justify-content-center">
            <h4>Pieces</h4>
            {skill.armor.map(a => 
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
        </div>
      : <h4 className="m-5">No armor with skill</h4>}
      <div className="row justify-content-center">
        <div className="my-4 col-sm-4">
          {skill.armorSets.length > 0 ?
            <MaterialTable
              title="Armor with skill"
              columns={set_columns} 
              data={skill.armorSets}
              onRowClick={(event, data) => {
                nav(`/armor-sets/${data.id}`)
              }}
              options={{
                pageSize:2,
                search:false,
                filtering:false,
                tableLayout:"fixed"
              }}
            />
          : <h4 className="m-5">No armor sets with skill</h4>}
        </div>
        <div className="my-4 col-sm-4">
          {skill.decorations.length > 0 ?
            <MaterialTable
              title="Charms with skill"
              columns={charm_columns} 
              data={skill.charms}
              onRowClick={(event, data) => {
                nav(`/charms/${data.id}`)
              }}
              options={{
                pageSize:2,
                search:false,
                filtering:false,
                tableLayout:"fixed"
              }}
            />
          : <h4 className="m-5">No charms with skill</h4>}
        </div>
        <div className="my-4 col-sm-4">
          {skill.decorations.length > 0 ?
            <MaterialTable
              title="Decorations with skill"
              columns={deco_columns} 
              data={skill.decorations}
              onRowClick={(event, data) => {
                nav(`/decorations/${data.id}`)
              }}
              options={{
                pageSize:2,
                search:false,
                filtering:false,
                tableLayout:"fixed"
              }}
            />
          : <h4 className="m-5">No decorations with skill</h4>}
        </div>
      </div>
    </div>
  )
}

export default SkillDetail;