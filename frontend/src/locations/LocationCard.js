import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LocationCard = ({id, name}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/locations/${id}`)
  }

  return (
    <Card className="my-3 mx-3" onClick={handleClick} style={{width: '30vw', cursor: "pointer"}}>
      <Card.Body>
        <Card.Title style={{cursor: "pointer"}}>{name}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default LocationCard;