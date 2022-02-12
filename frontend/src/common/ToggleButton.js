import React, { useState, useContext, useEffect } from "react";
import UserContext from "../auth/userContext";
import { Button } from "react-bootstrap";

const ToggleButton = ({id, type, spacing, add, remove}) => {
  const currentUser = useContext(UserContext);
  const [exists, setExists] = useState(null);

  useEffect(() => {
    if (currentUser[type]) {
      setExists(currentUser[type].includes(id));
    }
  }, [currentUser[type]]);

  const handleAdd = () => {
    add(id, type);
  }

  const handleRemove = () => {
    remove(id, type);
  }

  return (
    <>
      {exists ? <Button className={spacing} variant="success" size="sm" onClick={handleRemove}>Sell?</Button> : <Button className={spacing} variant="danger" size="sm" onClick={handleAdd}>Craft?</Button>}
    </>
  )
}

export default ToggleButton;