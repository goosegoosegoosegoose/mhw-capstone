import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import MaterialTable from '@material-table/core';
import { ThemeProvider, createTheme } from "@material-ui/core";
import ToggleButton from "../common/ToggleButton";
import PlusButton from "../common/PlusButton";
import MinusButton from "../common/MinusButton";
import DecoCounter from "../common/DecoCounter";
import ArmorCard from "../armor/ArmorCard";
import MonsterCard from "../monsters/MonsterCard";
import WeaponCard from "../weapons/WeaponCard";

const ProfilePage = ({add, remove, plus, minus}) => {
  const [user, setUser] = useState({});
  // const [username, setUsername] = useState(name => name);
  const { username } = useParams()
  const nav = useNavigate();
  const charm_col = [
    {title:"Name", field:"name", filtering:false},
    {title:"Level", field:"level", searhable:false,
      lookup:{
        1:1,
        2:3,
        3:3,
        4:4,
        5:5
      }
    },
    {title:"Rarity", field:"rarity", searchable:false,
      lookup:{
        1:1,
        2:2,
        3:3,
        4:4,
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
  const deco_col = [
    {title:"Name", field:"name", filtering:false},
    {title:"Slot", field:"slot", searchable:false,
      lookup:{
        1:1,
        2:2,
        3:3
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
  const theme = createTheme({
    palette:{
      type:'dark'
    }
  });

  useEffect(function fetchUserWhenMounted() {
    async function fetchUser() {
      const res = await MhwApi.getUser(username);
      setUser(res);
    }
    fetchUser()
  }, []);

  if (!user.armor) {
    return (
      <div className="container text-center">
        <p>Please log in.</p>
      </div>
    )
  } 

  return (
    <div className="container text-center">
      <div className="row d-flex align-items-center my-4">
        <h1>{user.username}</h1>
        <h4>{user.email}</h4>
      </div>
      <div className="row justify-content-center my-4">
        <ThemeProvider theme={theme}>
          <div className="col-sm-6">
            <MaterialTable
              title="Charms"
              columns={charm_col} 
              data={user.charms}
              onRowClick={(event, data) => {
                nav(`/charms/${data.id}`)
              }}
              actions={[
                rowData => ({
                  icon:()=><ToggleButton id={rowData.id} type="charms" spacing="my-1 mt-auto" add={add} remove={remove} label1="Sell?" label2="Craft?"/>,
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
                  actions: 'Have?'
                }
              }}
            />
          </div>
          <div className="col-sm-6">
            <MaterialTable
              title="Decorations"
              columns={deco_col} 
              data={user.decorations}
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
        </ThemeProvider>
        <div className="row d-flex justify-content-center my-3">
          <h4 className="mt-4">Weapons</h4>
          {user.weapons.map(w => 
            <WeaponCard
              key={w.id}
              id={w.id}
              name={w.name}
              img={w.img}
              add={add}
              remove={remove}
            />
          )}
        </div>
        <div className="row d-flex justify-content-center my-3">
          <h4 className="mt-4">Armor</h4>
          {user.armor.map(a => 
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
        <div className="row d-flex justify-content-center my-3">
          <h4 className="mt-4">Monsters</h4>
          {user.monsters.map(m => 
            <MonsterCard
              key={m.id}
              id={m.id}
              name={m.name}
              icon={m.icon}
              add={add}
              remove={remove}
            />
          )}
        </div>
      </div>
  </div>
  )
}

export default ProfilePage;