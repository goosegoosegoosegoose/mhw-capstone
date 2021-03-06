import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ToggleButton from "../common/ToggleButton";


const ArmorCard = ({id, name, mImg, fImg, add, remove}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/armor/${id}`)
  }

  return (
    <Card className="my-2 mx-1 col-sm-2" bg="dark">
      <div className="row">
        <div className="col-sm-6 pt-2 mt-2">
          {mImg ? <Card.Img style={{cursor: "pointer"}} onClick={handleClick} variant="top" src={mImg} alt="male armor image" /> : <></>}
        </div>
        <div className="col-sm-6 pt-2 mt-2">
          {fImg ? <Card.Img style={{cursor: "pointer"}} onClick={handleClick} variant="top" src={fImg} alt="female armor image" /> : <></>}
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title style={{cursor: "pointer"}} onClick={handleClick}>{name}</Card.Title>
        <ToggleButton id={id} type="armor" spacing="my-1 mt-auto" add={add} remove={remove} label1="Crafted" label2="Craft"/>
      </Card.Body>
    </Card>
  )
}

export default ArmorCard;