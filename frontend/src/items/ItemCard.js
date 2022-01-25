import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ItemCard = ({slug, name, rarity}) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/items/${slug}`)
  }

  return (
    <Card className="my-4" style={{width: '70vw', cursor: "pointer"}} onClick={handleClick}>
      <Card.Title>{name}</Card.Title>
      <Card.Text>{rarity}</Card.Text>
    </Card>
  )
}

export default ItemCard;