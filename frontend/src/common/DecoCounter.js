import React, { useState, useContext, useEffect } from "react";
import UserContext from "../auth/userContext";

const DecoCounter = ({id, c}) => {
  const currentUser = useContext(UserContext);
  const [counter, setCounter] = useState((currentUser.decorations ? (currentUser.decorations[id] ? currentUser.decorations[id] : 0) : 0));

  useEffect(() => {
    if (currentUser.decorations) {
      if (!currentUser.decorations[id]) {
        setCounter(0)
      } else {
        setCounter(currentUser.decorations[id])
      }
    }
  }, [currentUser.decorations]);

  return (
    <>
      <span className={c} >{counter}</span>
    </>
  )
}

export default DecoCounter;