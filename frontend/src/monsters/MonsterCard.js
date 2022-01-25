import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const MonsterCard = ({id, name, type}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/monsters/${id}`)
  }

  return(
    <Card className="my-4" style={{width: '70vw', cursor: "pointer"}} onClick={handleClick}>
      <Card.Title>{name}</Card.Title>
      <Card.Text>{type}</Card.Text>
    </Card>
  )
}

export default MonsterCard;