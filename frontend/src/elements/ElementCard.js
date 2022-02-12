import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ElementCard = ({ele}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/elements/${ele}`)
  }

  return (
    <Card className="my-3 mx-3 col-lg-5" style={{cursor: "pointer"}} onClick={handleClick}>
      <Card.Body>
        <Card.Title>{ele}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default ElementCard;