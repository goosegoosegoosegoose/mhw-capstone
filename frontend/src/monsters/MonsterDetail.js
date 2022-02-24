import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from "@material-table/core";
import { ThemeProvider, createTheme } from "@material-ui/core";
import ToggleButton from "../common/ToggleButton";

const MonsterDetail = ({add, remove}) => {
  const [monster, setMonster] = useState({});
  const { id } = useParams();
  const nav = useNavigate();
  let locationCount = 0;
  const weakColumns = [
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
  const matColumns = [
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
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });
  
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
      <div className="row d-flex align-items-center">
        <div className="col-sm-6">
          <div className="d-flex">
            <h1 className="m-1">{monster.name}</h1>
            <ToggleButton id={Number(id)} type="weapons" spacing="m-3" add={add} remove={remove} label1="Un-hunt?" label2="Hunted?"/>
          </div>
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
              </div> : <div className="mb-3">{monster.name}s have no offensive ailments.</div>}
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <img src={monster.img} className="img-fluid"/>
        </div>
      </div>
      <ThemeProvider theme={theme}>
        <div className="row mx-2 mb-4">
          <MaterialTable 
            title="Weak to"
            columns={weakColumns} 
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
        <div className="row mx-2 justify-content-center">
          {monster.materials.length > 0 ? <MaterialTable 
            title="Material rewards"
            columns={matColumns} 
            data={monster.materials}
            options={{
              pageSize:6,
              search:true,
              filtering:true
            }}
          /> : <h4 className="m-5">No material info provided</h4>}
        </div>
      </ThemeProvider>
    </div>
  )
};

export default MonsterDetail;