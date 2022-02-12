import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from "@material-table/core";

const MonsterDetail = () => {
  const [monster, setMonster] = useState({});
  const { id } = useParams();
  const nav = useNavigate();
  let locationCount = 0;
  const weak_columns = [
    {title:"Element", field:"element"},
    {title:"Stars", field:"stars",
      lookup:{
        1:1,
        2:2,
        3:3
      }
    },
    {title:"Condition", field:"condition", searchable:false}
  ];
  const mat_columns = [
    {title:"Material", field:"material", filtering:false},
    {title:"From", field:"type", searchable:false,
      lookup:{
        carve:"Carve",
        investigation:"Investigation",
        palico:"Palico",
        plunderblade:"Plunderblade",
        reward:"Quest Reward",
        shiny:"Shiny",
        track:"Tracks",
        wound:"Wound"
      }
    },
    {title:"Additional Info", field:"subtype", searchable:false},
    {title:"Quantity", field:"quantity", searchable:false},
    {title:"%Chance", field:"chance", searchable:false},
    {title:"Rank", field:"rank", searchable:false,
      lookup: {
        low: "Low",
        high: "High",
        master: "Master"
      }
    }
  ];
  
  useEffect(() => {
    const fetchMonster = async () => {
      const res = await MhwApi.getOne("monsters", id);
      setMonster(res);
    }
    fetchMonster();
  }, [id]);

  if (!monster.materials) {
    return (
      <p>No monster found</p>
    )
  }

  return (
    <div className="container">
      <h1 className="m-1">{monster.name}</h1>
      <div className="m-3">
        <p>Species: {monster.species}</p>
        <p>Type: {monster.type}</p>
        <p>Spawns in {monster.locations.map(l => {
          locationCount++;
          if (locationCount === monster.locations.length) {
            return <span key={l.id}><a href={`/locations/${l.id}`}>{l.location}</a>.</span>
          }
          return <span key={l.id}><a href={`/locations/${l.id}`}>{l.location}</a>, </span>
        })} </p>
        <p>{monster.description}</p>
        <div className="row">
          {monster.ailments.length >0 ? <div>
            Could inflict:
            <ul>
              {monster.ailments.map(a => 
                <li key={a.id}>{a.ailment}: {a.description}</li>
              )}
            </ul>
          </div> : <div className="mb-3">Monster has no offensive ailments</div>}
        </div>
        <div className="row m-1">
          <MaterialTable 
            title="Weak to"
            columns={weak_columns} 
            data={monster.weaknesses}
            onRowClick={(event, data) => {
              nav(`/elements/${data.element}`)
            }}
            options={{
              pageSize:5,
              search:false,
              filtering:false
            }}
          />
        </div>
        <div className="row m-1 justify-content-center">
          {monster.materials.length > 0 ? <MaterialTable 
            title="Material rewards"
            columns={mat_columns} 
            data={monster.materials}
            options={{
              pageSize:6,
              search:true,
              filtering:true
            }}
          /> : <h4 className="m-5">No material info provided</h4>}
        </div>
      </div>
    </div>
  )
};

export default MonsterDetail;