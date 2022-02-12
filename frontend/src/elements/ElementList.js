import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import MhwApi from "../api";
import ElementCard from "./ElementCard";

const ElementList = () => {
  const [elements, setElements] = useState([]);

  useEffect(function fetchElementsWhenMounted() {
    async function fetchElements() {
      const res = await MhwApi.request("elements");
      setElements(res)
    }
    fetchElements()
  }, []);

  if (!elements) {
    return (
      <div className="container text-center">
        <p>Loading</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <div className="row justify-content-center">
        {elements.map(e => 
          <ElementCard
            key={e.element}
            ele={e.element}
          />
        )}
      </div>
  </div>
  )
}

export default ElementList;