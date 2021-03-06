import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import UserContext from "../auth/userContext";

const PlusButton = ({id, spacing, plus}) => {
  const currentUser = useContext(UserContext);

  const handlePlus = (evt) => {
    evt.stopPropagation();
    plus(id)
  }

  if (!currentUser) {
    return (
      <Button className={spacing} variant="info" style={{color: "#ffffff"}} size="sm" onClick={handlePlus}>+1<span className="MuiTouchRipple-root"></span></Button>
    )
  }

  return (
    <>
      <Button className={spacing} variant="info" style={{color: "#ffffff"}} size="sm" onClick={handlePlus}>+1</Button>
    </>
  )
}

export default PlusButton;