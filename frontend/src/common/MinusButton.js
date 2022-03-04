import React, { useState, useContext, useEffect } from "react";
import UserContext from "../auth/userContext";
import { Button } from "react-bootstrap";

const MinusButton = ({id, spacing, minus}) => {
  const currentUser = useContext(UserContext);
  const [exists, setExists] = useState((currentUser.decorations ? currentUser.decorations.hasOwnProperty(id) : false));

  useEffect(() => {
    if (currentUser.decorations) {
      setExists(currentUser.decorations.hasOwnProperty(id));
    }
  }, [currentUser.decorations]);

  const handleMinus = (evt) => {
    evt.stopPropagation();
    minus(id);
  }

  if (!currentUser) {
    return (
      <Button className={spacing} variant="danger" size="sm" onClick={handleMinus} disabled>-1</Button>
    )
  }

  return (
    <Button className={spacing} variant={exists ? "light" : "dark"} size="sm" onClick={handleMinus} disabled={!exists}>{exists ? "-1" : null}</Button>
  )
}

export default MinusButton