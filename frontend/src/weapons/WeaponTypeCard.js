import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WeaponTypeCard = ({type, img}) => {
  const nav = useNavigate();
  const unslugify = (slug) => {
    const result = slug.replace(/\-/g, " ");
    return result.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })
  }
  const title = unslugify(type);

  const handleClick = () => {
    nav(`/weapons/${type}`)
  }

  return (
    <Card className="my-3 mx-3 col-lg-3" style={{cursor: "pointer"}} onClick={handleClick} bg="dark">
      <div className="row justify-content-center">
        <div className="col-sm-8 pt-2 mt-2">
          {img ? <Card.Img variant="top" src={img} /> : <></>}
        </div>
      </div>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default WeaponTypeCard;