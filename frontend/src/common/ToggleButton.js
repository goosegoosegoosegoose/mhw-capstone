import React, { useState, useContext } from "react";
import UserContext from "../auth/userContext";
import { Button } from "react-bootstrap";

const ToggleButton = ({id, type, spacing, add, remove, label1, label2}) => {
  const currentUser = useContext(UserContext);
  const [exists, setExists] = useState((currentUser ? (currentUser[type] ? currentUser[type].includes(id) : false): false));

  const handleAdd = (evt) => {
    evt.stopPropagation();
    add(id, type);
    setExists(true);
  }

  const handleRemove = (evt) => {
    evt.stopPropagation();
    remove(id, type);
    setExists(false);
  }

  if (!currentUser) {
    return (
      <Button className={spacing} variant="danger" size="sm" onClick={handleAdd} disabled>{label2}</Button>
    )
  }

  return (
    <>
      {exists ? <Button className={spacing} variant="info" style={{color: "#ffffff"}} size="sm" onClick={handleRemove}>{label1}</Button> : <Button className={spacing} variant="light" size="sm" onClick={handleAdd}>{label2}</Button>}
    </>
  )
}

export default ToggleButton;