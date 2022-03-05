import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ElementCard = ({ele, img}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/elements/${ele}`)
  }

  return (
    <Card className="my-3 mx-3 col-lg-2" style={{cursor: "pointer"}} onClick={handleClick} bg="dark">
      <div className="row justify-content-center">
        <div className="col-sm-8 pt-2 mt-2">
          {img ? <Card.Img variant="top" src={img} alt="element" /> : <></>}
        </div>
      </div>
      <Card.Body>
        <Card.Title>{(ele ? ele.toUpperCase() : null)}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default ElementCard;