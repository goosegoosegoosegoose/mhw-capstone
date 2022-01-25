import React, { useContext, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../auth/userContext"


const ArmorCard = ({id, name, add, remove}) => {
  const nav = useNavigate();
  const currentUser = useContext(UserContext);
  const [exists, setExists] = useState(currentUser.armors ? currentUser.armors.includes(id) : false)
  
  const handleClick = () => {
    nav(`/armors/${id}`)
  }

  const handleAdd = (evt) => {
    add(evt);
    setExists(true);
  }

  const handleRemove = (evt) => {
    remove(evt);
    setExists(false);
  }

  return(
    <Card className="my-4" style={{width: '70vw'}}>
      <Card.Body>
        <Card.Title style={{cursor: "pointer"}} onClick={handleClick}>{name}</Card.Title>
        <Card.Text>yeee</Card.Text>
        {exists ? <Button id={id} data-type="armors" variant="danger" size="sm" onClick={handleRemove}>Have</Button> : <Button id={id} data-type="armors" variant="primary" size="sm" onClick={handleAdd}>Don't Have</Button>}
      </Card.Body>
    </Card>
  )
}

export default ArmorCard;