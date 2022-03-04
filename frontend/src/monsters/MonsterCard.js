import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ToggleButton from "../common/ToggleButton";


const MonsterCard = ({id, name, icon, add, remove}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/monsters/${id}`)
  }

  return(
    <Card className="my-3 mx-3 col-sm-3" style={{cursor: "pointer"}} bg="dark">
      <div className="row justify-content-center">
        <div className="col-sm-8 pt-2 mt-2">
          {icon ? <Card.Img style={{cursor: "pointer"}} onClick={handleClick} variant="top" src={icon} /> : <></>}
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title onClick={handleClick}>{name}</Card.Title>
        <ToggleButton id={Number(id)} type="monsters" spacing="my-1 mx-5 mt-auto" add={add} remove={remove} label1="Hunted" label2="Hunt"/>
      </Card.Body>
    </Card>
  )
}

export default MonsterCard;