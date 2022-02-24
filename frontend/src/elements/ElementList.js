import React, { useState, useEffect } from "react";
import MhwApi from "../api";
import SearchForm from "../common/SearchForm";
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
        <h1>Elements</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container text-center">
      <h1>Elements</h1>
      <div className="row justify-content-center">
        {elements.map(e => 
          <ElementCard
            key={e.element}
            ele={e.element}
            img={e.img}
          />
        )}
      </div>
  </div>
  )
}

export default ElementList;