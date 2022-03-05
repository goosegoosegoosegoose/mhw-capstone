import React, { useState, useContext, useEffect } from "react";
import UserContext from "../auth/userContext";

const DecoCounter = ({id, c}) => {
  const currentUser = useContext(UserContext);
  const [counter, setCounter] = useState((currentUser ? (currentUser.decorations ? (currentUser.decorations[id] ? currentUser.decorations[id] : 0) : 0) : 0));
  let change = (currentUser ? currentUser.decorations : null)

  useEffect(() => {
    const updateCount = () => {
      if (currentUser) {
        if (currentUser.decorations) {
          if (!currentUser.decorations[id]) {
            setCounter(0)
          } else {
            setCounter(currentUser.decorations[id])
          }
        }
      }
    }
    updateCount();
  }, [change]);

  return (
    <>
      <span className={c} >{counter}</span>
    </>
  )
}

export default DecoCounter;