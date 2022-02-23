import React, { useState, useContext, useEffect } from "react";
import UserContext from "../auth/userContext";
import { Button } from "react-bootstrap";

const MinusButton = ({id, spacing, minus}) => {
  const currentUser = useContext(UserContext);
  const [exists, setExists] = useState(null);

  useEffect(() => {
    if (currentUser.decorations) {
      setExists(currentUser.decorations.hasOwnProperty(id));
    }
  }, [currentUser.decorations])

  const handleMinus = () => {
    minus(id)
  }
  
  if (!currentUser) {
    return (
      <Button className={spacing} variant="danger" size="sm" onClick={handleMinus} disabled>-1</Button>
    )
  }

  return (
    <>
      {exists ? <Button className={spacing} variant="danger" size="sm" onClick={handleMinus}>-1</Button>
      : <Button className={spacing} variant="danger" size="sm" onClick={handleMinus} disabled>-1</Button>}
    </>
  )
}

export default MinusButton