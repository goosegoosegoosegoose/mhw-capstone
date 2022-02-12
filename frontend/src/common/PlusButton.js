import React from "react";
import { Button } from "react-bootstrap";

const PlusButton = ({id, spacing, plus}) => {

  const handlePlus = () => {
    plus(id)
  }

  return (
    <>
      <Button className={spacing} variant="success" size="sm" onClick={handlePlus}>+1</Button>
    </>
  )
}

export default PlusButton;