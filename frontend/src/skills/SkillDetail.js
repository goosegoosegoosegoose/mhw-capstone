import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import ArmorCard from "../armor/ArmorCard";
import MaterialTable from "@material-table/core";
import { ThemeProvider, createTheme } from "@material-ui/core";
import DecoCounter from "../common/DecoCounter";
import PlusButton from "../common/PlusButton";
import MinusButton from "../common/MinusButton";

const SkillDetail = ({add, remove, plus, minus}) => {
  const [skill, setSkill] = useState({});
  const { id } = useParams();
  const nav = useNavigate();
  const setColumns = [
    {title:"Armor Set", field:"name"},
    {title:"Pieces Needed", field:"pieces"}
  ];
  const charmColumns = [
    {title:"Charm", field:"name"},
    {title:"Level", field:"level"},
    {title:"Rarity", field:"rarity"}
  ];
  const decoColumns = [
    {title:"Decoration", field:"name"},
    {title:"Rarity", field:"rarity"},
    {title:"Slot", field:"slot"}
  ];
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });

  useEffect(function fetchSkillWhenMounted() {
    async function fetchSkill() {
      const res = await MhwApi.getOne("skills", id);
      setSkill(res)
    }
    fetchSkill()
  }, [id]);


  if (!skill.decorations) {
    return (
      <div>Loading...</div>
    )
  }

  return(
    <div className="container">
      <h1 className="m-1">{skill.name}</h1>
      <div className="m-3 mt-4">
        <h5 className="m-1 mt-3">Skill level {skill.level}.</h5>
        <h5 className="m-1 mt-3">Effect : {skill.description}</h5>
      </div>
      {skill.armor.length > 0 ? 
        <div className="text-center my-4">
          <div className="row justify-content-center">
            <h4>Armor Pieces with Skill</h4>
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
      : null}
        <ThemeProvider theme={theme}>
          <div className="my-4">
            {skill.armorSets.length > 0 ?
              <MaterialTable
                title="Armor with skill"
                columns={setColumns} 
                data={skill.armorSets}
                onRowClick={(event, data) => {
                  nav(`/armor-sets/${data.id}`)
                }}
                options={{
                  paging:false,
                  search:false,
                  filtering:false,
                  tableLayout:"fixed"
                }}
              />
            : null}
          </div>
          <div className="my-4">
            {skill.decorations.length > 0 ?
              <MaterialTable
                title="Charms with skill"
                columns={charmColumns} 
                data={skill.charms}
                onRowClick={(event, data) => {
                  nav(`/charms/${data.id}`)
                }}
                options={{
                  paging:false,
                  search:false,
                  filtering:false,
                  tableLayout:"fixed"
                }}
              />
            : <h4 className="m-5">No charms with skill</h4>}
          </div>
          <div className="my-4">
            {skill.decorations.length > 0 ?
              <MaterialTable
                title="Decorations with skill"
                columns={decoColumns} 
                data={skill.decorations}
                onRowClick={(event, data) => {
                  nav(`/decorations/${data.id}`)
                }}
                actions={[{
                  icon: "DecoActions"
                }]}
                components ={{
                  Action: rowData =>
                    <div className="d-flex">
                      <DecoCounter id={rowData.data.id}  c="mx-2 my-auto"/>
                      <PlusButton id={rowData.data.id}  spacing="mx-2 my-2" plus={plus} />
                      <MinusButton id={rowData.data.id} spacing="mx-2 my-2" minus={minus} />
                    </div>
                }}
                options={{
                  paging:false,
                  search:false,
                  filtering:false
                }}
                localization={{
                  header: {
                    actions: 'Amount in Inventory'
                  }
                }}
              />
            : null}
          </div>
        </ThemeProvider>
    </div>
  )
}

export default SkillDetail;