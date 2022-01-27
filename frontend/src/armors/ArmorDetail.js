import React, { useContext, useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../auth/userContext"
import MhwApi from "../api";

const ArmorDetail = ({add, remove}) => {
  const [armor, setArmor] = useState({});
  const { id } = useParams();
  const currentUser = useContext(UserContext);
  const [exists, setExists] = useState(currentUser.armors ? currentUser.armors.includes(id) : false)

  useEffect(function fetchArmorWhenMounted () {
    async function fetchArmor() {
      const res = await MhwApi.getOne("armors", id);
      setArmor(res);
    }
    fetchArmor();
  }, []);

  const handleAdd = (evt) => {
    add(evt);
    setExists(true);
  }

  const handleRemove = (evt) => {
    remove(evt);
    setExists(false);
  }

  return (
    <div>
      <h1>{armor.name}</h1>
      {exists ? <Button id={id} data-type="armors" variant="danger" size="sm" onClick={handleRemove}>Have</Button> : <Button id={id} data-type="armors" variant="primary" size="sm" onClick={handleAdd}>Don't Have</Button>}
    </div>
  )
}

export default ArmorDetail;