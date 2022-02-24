import React, { useContext, useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../auth/userContext";
import ToggleButton from "../common/ToggleButton";


const ArmorCard = ({id, name, mImg, fImg, add, remove}) => {
  const nav = useNavigate();
  const currentUser = useContext(UserContext);
  const [exists, setExists] = useState(currentUser.armor ? currentUser.armor.includes(id) : false)
  
  useEffect(()=>{
    if (currentUser.armor) {
      setExists(currentUser.armor.includes(id));
    }
  }, [currentUser.armor]);

  const handleClick = () => {
    nav(`/armor/${id}`)
  }

  return (
    <Card className="my-2 mx-1 col-sm-2" bg="dark">
      <div className="row">
        <div className="col-sm-6 pt-2 mt-2">
          {mImg ? <Card.Img style={{cursor: "pointer"}} onClick={handleClick} variant="top" src={mImg} /> : <></>}
        </div>
        <div className="col-sm-6 pt-2 mt-2">
          {fImg ? <Card.Img style={{cursor: "pointer"}} onClick={handleClick} variant="top" src={fImg} /> : <></>}
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title style={{cursor: "pointer"}} onClick={handleClick}>{name}</Card.Title>
        <ToggleButton id={id} type="armor" spacing="my-1 mt-auto" add={add} remove={remove} label1="Sell?" label2="Craft?"/>
      </Card.Body>
    </Card>
  )
}

export default ArmorCard;