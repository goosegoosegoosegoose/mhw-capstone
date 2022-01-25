import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import MhwApi from "../api"

const MonsterDetail = () => {
  const { id } = useParams();
  const [monster, setMonster] = useState(Null);

  useEffect(() => {
    const fetchMonster = async () => {
      const res = await MhwApi.getOne("monsters", id);
      setMonster(res);
    }
    fetchMonster();
  }, []);

  if (!monster) {
    return (
      <p>No monster found</p>
    )
  }
  
  return (
    <div className="mx-2">
    <h4>{monster.name}</h4>
    <p>{monster.description}</p>
  </div>
  )
};

export default MonsterDetail;