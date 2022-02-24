import React, { useContext, useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../auth/userContext";
import ToggleButton from "../common/ToggleButton";


const WeaponCard = ({id, name, img, add, remove}) => {
  const nav = useNavigate();
  const currentUser = useContext(UserContext);
  const [exists, setExists] = useState(currentUser.weapons ? currentUser.weapons.includes(id) : false)
  
  useEffect(()=>{
    if (currentUser.weapons) {
      setExists(currentUser.weapons.includes(id));
    }
  }, [currentUser.weapons]);

  const handleClick = () => {
    nav(`/weapons/w/${id}`)
  }

  return (
    <Card className="my-2 mx-1 col-sm-2" bg="dark">
      <div className="row justify-content-center">
        <div className="col-sm-8 pt-2 mt-2">
          {img ? <Card.Img style={{cursor: "pointer"}} onClick={handleClick} variant="top" src={img} /> : <></>}
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title style={{cursor: "pointer"}} onClick={handleClick}>{name}</Card.Title>
        <ToggleButton id={Number(id)} type="weapons" spacing="my-1 mt-auto" add={add} remove={remove} label1="Sell?" label2="Craft?"/>
      </Card.Body>
    </Card>
  )
}

export default WeaponCard;