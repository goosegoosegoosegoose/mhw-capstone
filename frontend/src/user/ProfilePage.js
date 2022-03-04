import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
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
  const { username } = useParams();
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
        <div className="d-inline-flex justify-content-center">
          <h4>{user.email}</h4>
          <Button className="ms-3" size="sm" variant="dark" onClick={()=> nav("/email/edit")}>edit email</Button>
        </div>
      </div>
      <div className="row justify-content-center my-4">
        <ThemeProvider theme={theme}>
          <div className="col-sm-6">
            <Button className="m-1" variant="dark" size="sm" onClick={()=> nav("/charms")}>craft charms</Button>
            <MaterialTable
              title="Charms"
              columns={charm_col} 
              data={user.charms}
              actions={[{
                icon: "ToggleButton"
              }]}
              components ={{
                Action: props => (
                  <div className="d-flex justify-content-center">
                    <ToggleButton id={props.data.id} type="charms" spacing="mx-3" add={add} remove={remove} label1="Crafted" label2="Craft"/>
                  </div>
                )
              }}
              options={{
                pageSize:10,
                search:true,
                filtering:true
              }}
              localization={{
                header: {
                  actions: 'Crafted?'
                }
              }}
            />
          </div>
          <div className="col-sm-6">
          <Button className="m-1" variant="dark" size="sm" onClick={()=> nav("/decorations")}>loot decorations</Button>
            <MaterialTable
              title="Decorations"
              columns={deco_col} 
              data={user.decorations}
              onRowClick={(event, data) => {
                nav(`/decorations/${data.id}`)
              }}
              actions={[{
                icon: "DecoActions"
              }]}
              components ={{
                Action: rowData =>
                  <div className="d-flex justify-content-center">
                    <DecoCounter id={rowData.data.id}  c="mx-2 my-auto"/>
                    <PlusButton id={rowData.data.id}  spacing="mx-1 me-auto" plus={plus} />
                    <MinusButton id={rowData.data.id} spacing="mx-1 me-auto" minus={minus} />
                  </div>
              }}
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
          <div className="d-inline-flex justify-content-center mt-4">
            <h4>Weapons</h4>
            <Button className="ms-3" variant="dark" size="sm" onClick={()=> nav("/weapons")}>craft weapons</Button>
          </div>
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
          <div className="d-inline-flex justify-content-center mt-4">
            <h4>Armor</h4>
            <Button className="ms-3" variant="dark" size="sm" onClick={()=> nav("/armor")}>craft armor</Button>
          </div>
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
          <div className="d-inline-flex justify-content-center mt-4">
            <h4>Monsters</h4>
            <Button className="ms-3" variant="dark" size="sm" onClick={()=> nav("/monsters")}>hunt monsters</Button>
          </div>
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