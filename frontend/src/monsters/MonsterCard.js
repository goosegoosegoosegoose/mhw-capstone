import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const MonsterCard = ({id, name}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/monsters/${id}`)
  }

  return(
    <Card className="my-3 mx-3 col-sm-3" style={{cursor: "pointer"}} onClick={handleClick}>
      <Card.Title>{name}</Card.Title>
    </Card>
  )
}

export default MonsterCard;