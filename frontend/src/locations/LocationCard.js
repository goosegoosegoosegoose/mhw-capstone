import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LocationCard = ({id, name, icon}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/locations/${id}`)
  }

  return (
    <Card className="my-3 mx-3" onClick={handleClick} style={{width: '30vw', cursor: "pointer"}} bg="dark">
      <div className="row justify-content-center">
        <div className="col-sm-11 pt-2 mt-2">
          {icon ? <Card.Img style={{cursor: "pointer"}} onClick={handleClick} variant="top" src={icon} /> : <></>}
        </div>
      </div>
      <Card.Body>
        <Card.Title style={{cursor: "pointer"}}>{name}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default LocationCard;