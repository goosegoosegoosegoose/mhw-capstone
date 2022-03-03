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

  const handleMinus = (event) => {
    event.stopPropagation();
    minus(id)
  }
  
  if (!currentUser) {
    return (
      <Button className={spacing} variant="danger" size="sm" onClick={handleMinus} disabled>-1</Button>
    )
  }

  return (
    <Button className={spacing} variant="light" size="sm" onClick={handleMinus} disabled={!exists}>{exists ? "-1" : "-x"}</Button>

  )
}

export default MinusButton