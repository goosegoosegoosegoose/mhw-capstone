import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MhwApi from "../api";
import { Form } from "react-bootstrap";

const GearingPage = () => {
  const { username } = useParams();
  const [gear, setGear] = useState({});
  const [equipped, setEquipped] = useState({weapon: {slots:{1: 0, 2: 0, 3: 0, 4: 0}}, head: {slots:{1: 0, 2: 0, 3: 0, 4: 0}}, chest: {slots:{1: 0, 2: 0, 3: 0, 4: 0}}, gloves: {slots:{1: 0, 2: 0, 3: 0, 4: 0}}, waist: {slots:{1: 0, 2: 0, 3: 0, 4: 0}}, legs: {slots:{1: 0, 2: 0, 3: 0, 4: 0}}, charm: {}});
  const [decoSlots, setDecoSlots] = useState({1: 0, 2: 0, 3: 0, 4: 0});
  const [maxed, setMaxed] = useState({1:{count:0, full:false}, 2:{count:0, full:false}, 3:{count:0, full:false}, 4:{count:0, full:false}});
  const [skills, setSkills] = useState({});
  const [lastCharm, setLastCharm] = useState({skills: [null, null], levels: [0, 0], length:0});

  useEffect(function fetchGearWhenMounted() {
    async function fetchGear() {
      const res = await MhwApi.getGear(username);
      setGear(res)
    }
    fetchGear()
  }, []);

  useEffect(() => {
    if (equipped.weapon.id) {
      document.getElementById("weaponDefault").disabled = true;
    }
    if (equipped.head.id) {
      document.getElementById("headDefault").disabled = true;
    }
    if (equipped.chest.id) {
      document.getElementById("chestDefault").disabled = true;
    }
    if (equipped.gloves.id) {
      document.getElementById("glovesDefault").disabled = true;
    }
    if (equipped.waist.id) {
      document.getElementById("waistDefault").disabled = true;
    }
    if (equipped.legs.id) {
      document.getElementById("legsDefault").disabled = true;
    }
    if (equipped.charm.id) {
      document.getElementById("charmDefault").disabled = true;
    }
    const one = equipped.weapon.slots["1"] + equipped.head.slots["1"] + equipped.chest.slots["1"] + equipped.gloves.slots["1"] + equipped.waist.slots["1"] + equipped.legs.slots["1"];
    const two = equipped.weapon.slots["2"] + equipped.head.slots["2"] + equipped.chest.slots["2"] + equipped.gloves.slots["2"] + equipped.waist.slots["2"] + equipped.legs.slots["2"];
    const three = equipped.weapon.slots["3"] + equipped.head.slots["3"] + equipped.chest.slots["3"] + equipped.gloves.slots["3"] + equipped.waist.slots["3"] + equipped.legs.slots["3"];
    const four = equipped.weapon.slots["4"] + equipped.head.slots["4"] + equipped.chest.slots["4"] + equipped.gloves.slots["4"] + equipped.waist.slots["4"] + equipped.legs.slots["4"];
    setDecoSlots({1:one, 2:two, 3:three, 4:four});
  }, [equipped]);

  useEffect(() =>{
    if (equipped.weapon.attack && equipped.head.defense_base && equipped.chest.defense_base && equipped.gloves.defense_base && equipped.waist.defense_base && equipped.legs.defense_base){
      for (let j=1;j<5;j++) {
        if (decoSlots[j] > maxed[j].count) {
          setMaxed(a => ({...a, [j]: {...a[j], full:false}}))
        }
        if (decoSlots[j] <=  maxed[j].count) {
          setMaxed(a => ({...a, [j]: {...a[j], full:true}}))
        }
      }
    }
  }, [decoSlots]);

  const handleChange = evt => {
    const { name, value } = evt.target;
    const val = JSON.parse(value);
    const skillArr = [];
    const levelArr = [];
    if (name === "charm") {
      const s = val.skills;
      const c = val.skill_caps;
      for (let i=0;i<s.length;i++){
        let skill = s[i].slice(0, -2);
        let level = Number(s[i].slice(-1, s[i].length));
        skillArr.push(skill);
        levelArr.push(level);
        if (!skills[skill]) {
          if (lastCharm.skills[i]) {
            if (skills[lastCharm.skills[i]].level === lastCharm.levels[i]) {
              for (let k=0;k<lastCharm.length;k++){
                delete skills[lastCharm.skills[k]];
              }
              setSkills(a => ({...a, [skill]: {...a[skill], level: skills[skill].level + level}}))
            } else {
              for (let k=0;k<lastCharm.length;k++){
                setSkills(a => ({...a, [lastCharm.skills[k]]: {...a[lastCharm.skills[k]], level: skills[lastCharm.skills[k]].level - lastCharm.levels[k]}}))
              }
            }
          }
          setSkills(a => ({...a, [skill]: {level: level, cap: c[i]}}))
        } else {
          for (let k=0;k<lastCharm.length;k++){
            setSkills(a => ({...a, [lastCharm.skills[k]]: {...a[lastCharm.skills[k]], level: skills[lastCharm.skills[k]].level - lastCharm.levels[k]}}))
          }
          setSkills(a => ({...a, [skill]: {...a[skill], level: skills[skill].level + level}}))
        }
      }
      setLastCharm({skills: skillArr, levels: levelArr, length: val.skills.length})
    }
    setEquipped(eq => ({
      ...eq,
      [name]: val
    }));
  }

  const handleCheck = evt => {
    const {name, checked, value} = evt.target;
    const val = JSON.parse(value);
    const s = val.skills;
    const c = val.skill_caps;
    if (checked) { 
      for (let i=0;i<s.length;i++){
        let skill = s[i].slice(0, -2);
        let level = Number(s[i].slice(-1, s[i].length));
        if (!skills[skill]) {
          setSkills(a => ({...a, [skill]: {level: level, cap: c[i]}}))
        } else {
          setSkills(a => ({...a, [skill]: {...a[skill], level: skills[skill].level + level}}))
        }
      }
      if (maxed[name].count + 1 === decoSlots[name]) {
        setMaxed({...maxed, [name]: {count: maxed[name].count + 1, full:true}});
        return
      }
      setMaxed({...maxed, [name]: {...maxed[name], count: maxed[name].count + 1}})
    } else if (!checked) {
      for (let i=0;i<s.length;i++){
        let skill = s[i].slice(0, -2);
        let level = Number(s[i].slice(-1, s[i].length));
        if (skills[skill].level === level) {
          delete skills[skill]
          setSkills(a => ({...a}))
        } else {
          setSkills(a => ({...a, [skill]: {...a[skill], level: skills[skill].level - level}}))
        }
      }
      if (maxed[name].count === decoSlots[name]) {
        setMaxed({...maxed, [name]: {count: maxed[name].count - 1, full:false}});
        return
      }
      setMaxed({...maxed, [name]: {...maxed[name], count: maxed[name].count - 1}})
    }
  }

  if (!gear.weapons) {
    return (
      <h1>Loading.. please refresh</h1>
    )
  }

  return (
    <div className="container">
      <h1 className="my-2">Mock Gearing Page</h1>
      <h6>1. Please make sure you have crafted at least one weapon, one charm, and one head, chest, glove, waist, and leg armor piece before attempting to use.</h6>
      <h6>2. Fill out every dropdown menu on the left. Options are from your inventory.</h6>
      <h6>3. The decorations you've accumlated from the decorations page will appear after all forms have been filled. (except charms because they don't have decoration slots)</h6>
      <div className="row mt-5">
        <div className="col-sm-6">
          <Form>
            <Form.Group className="mb-2">
              <Form.Label htmlFor="weapon">Weapon</Form.Label>
              <select className="form-control" name="weapon" onChange={handleChange}>
                <option id="weaponDefault" value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
                  Choose weapon
                </option>
                {gear.weapons.map((a,i) => 
                  <option key={i} value={JSON.stringify(a)}>{a.name}</option>
                )}
              </select>
            </Form.Group> 
            <Form.Group className="my-2">
              <Form.Label htmlFor="head">Head</Form.Label>
              <select className="form-control" name="head" onChange={handleChange}>
                <option id="headDefault" value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
                  Choose helm
                </option>
                {gear.head.map((a,i) => 
                  <option key={i} value={JSON.stringify(a)}>{a.name}</option>
                )}
              </select>
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label htmlFor="chest">Chest</Form.Label>
              <select className="form-control" name="chest" onChange={handleChange}>
                <option id="chestDefault" value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
                  Choose chestpiece
                </option>                
                {gear.chest.map((a,i) => 
                  <option key={i} value={JSON.stringify(a)}>{a.name}</option>
                )}
              </select>
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label htmlFor="gloves">Gloves</Form.Label>
              <select className="form-control" name="gloves" onChange={handleChange}>
                <option id="glovesDefault" value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
                  Choose gauntlets
                </option>
                {gear.gloves.map((a,i) => 
                  <option key={i} value={JSON.stringify(a)}>{a.name}</option>
                )}
              </select>
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label htmlFor="waist">Waist</Form.Label>
              <select className="form-control" name="waist" onChange={handleChange}>
                <option id="waistDefault" value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
                  Choose coil
                </option>
                {gear.waist.map((a,i) => 
                  <option key={i} value={JSON.stringify(a)}>{a.name}</option>
                )}
              </select>
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label htmlFor="legs">Legs</Form.Label>
              <select className="form-control" name="legs" onChange={handleChange}>
                <option id="legsDefault" value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
                  Choose chausses
                </option>
                {gear.legs.map((a,i) => 
                  <option key={i} value={JSON.stringify(a)}>{a.name}</option>
                )}
              </select>
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label htmlFor="charm">Charm</Form.Label>
              {equipped.weapon.attack && equipped.head.defense_base && equipped.chest.defense_base && equipped.gloves.defense_base && equipped.waist.defense_base && equipped.legs.defense_base ?
                <select className="form-control" name="charm" onChange={handleChange}>
                <option id="charmDefault" value={JSON.stringify({})} defaultValue>
                  Choose charm
                </option>
                {gear.charms.map((a,i) => 
                  <option key={i} value={JSON.stringify(a)}>{a.name}</option>
                )}
                </select>
              : <select className="form-control" name="charm" style={{background: "gray"}} disabled>
                <option defaultValue>
                  Please choose weapon and armor
                </option>
                </select>
              }
            </Form.Group>                             
          </Form>
        </div>         
        <div className="col-sm-3">
          <div>
            <p><b>Attack</b>: {equipped.weapon.attack ? equipped.weapon.attack : 0}</p>
            <p><b>Affinity</b>: {equipped.weapon.affinity ? equipped.weapon.affinity : 0}</p>
            <p><b>Elderseal</b>: {equipped.weapon.elderseal ? equipped.weapon.elderseal : "?"}</p>
            {equipped.weapon ? (equipped.weapon.element ? (equipped.weapon.element.length === 1 ? 
              <div><p><b>Element</b>: {equipped.weapon.element[0]}({equipped.weapon.hidden[0] ? "hidden" : "visible"})</p><p><b>Elemental Damage</b>: {equipped.weapon.element_damage[0]}</p></div> : 
              <div><p><b>Elements</b>: {equipped.weapon.element[0]}({equipped.weapon.hidden[0] ? "hidden" : "visible"}) & {equipped.weapon.element[1]}({equipped.weapon.hidden[1] ? "hidden" : "visible"})</p><p><b>Elemental Damage</b>: {equipped.weapon.element_damage[0]} & {equipped.weapon.element_damage[1]}</p></div>) : null) : null}
            {equipped.weapon ? (equipped.weapon.damage_type ? <p><b>Damage type</b>: {equipped.weapon.damage_type}</p> : null) : null}
            {equipped.weapon ? (equipped.weapon.white_sharpness ? <div><b>*White Sharpness Values</b>: <ul>{equipped.weapon.white_sharpness.map((s,i) => <li key={i}>{s}</li>)}</ul> <b>*By handicraft level top to bottom descending</b></div> : null) : null}
            {equipped.weapon ? (equipped.weapon.coatings ? <p><b>Arrow Coatings</b>: |{equipped.weapon.coatings.map((c,i) => <span key={i}>|  {c}  |</span>)}|</p> : null) : null}
            {equipped.weapon ? (equipped.weapon.phials ? <div><p><b>Phial Type</b>: {equipped.weapon.phial_type}</p><p><b>Phial Damage</b>: {equipped.weapon.phial_damage}</p></div> : null) : null}
            {equipped.weapon ? (equipped.weapon.boost_type ? <p><b>Kinsect Boost Type</b>: {equipped.weapon.boost_type}</p> : null) : null}
            {equipped.weapon ? (equipped.weapon.deviation ? <div><p><b>Special Ammo</b>: {equipped.weapon.special_ammo}</p><p><b>Deviation</b>: {equipped.weapon.deviation}</p></div> : null) : null}
            {equipped.weapon ? (equipped.weapon.ammo_types ? <div><b>Ammo Types</b>:<ul>{equipped.weapon.ammo_types.map((a,i) => <li key={i}>{a}</li>)}</ul></div> : null) : null}
          </div>
        </div>
        <div className="col-sm-3">
          <p><b>Base Defense</b>: {(equipped.head ? (equipped.head.defense_base ? equipped.head.defense_base : 0) : 0) 
                            + (equipped.chest ? (equipped.chest.defense_base ? equipped.chest.defense_base : 0) : 0) 
                            + (equipped.gloves ? (equipped.gloves.defense_base ? equipped.gloves.defense_base : 0) : 0) 
                            + (equipped.waist ? (equipped.waist.defense_base ? equipped.waist.defense_base : 0) : 0)
                            + (equipped.legs ? (equipped.legs.defense_base ? equipped.legs.defense_base : 0) : 0) 
                            + (equipped.weapon ? (equipped.weapon.defense ? equipped.weapon.defense : 0) : 0)}
          </p>
          <p><b>Maxed Defense</b>: {(equipped.head ? (equipped.head.defense_max ? equipped.head.defense_max : 0) : 0) 
                          + (equipped.chest ? (equipped.chest.defense_max ? equipped.chest.defense_max : 0) : 0) 
                          + (equipped.gloves ? (equipped.gloves.defense_max ? equipped.gloves.defense_max : 0) : 0) 
                          + (equipped.waist ? (equipped.waist.defense_max ? equipped.gloves.defense_max : 0) : 0)
                          + (equipped.legs ? (equipped.legs.defense_max ? equipped.legs.defense_max : 0) : 0) 
                          + (equipped.weapon ? (equipped.weapon.defense ? equipped.weapon.defense : 0) : 0)}
          </p>
          <p><b>Augmented Defense</b>: {(equipped.head ? (equipped.head.defense_augmented ? equipped.head.defense_augmented : 0) : 0) 
                              + (equipped.chest ? (equipped.chest.defense_augmented ? equipped.chest.defense_augmented : 0) : 0) 
                              + (equipped.gloves ? (equipped.gloves.defense_augmented ? equipped.gloves.defense_augmented : 0) : 0) 
                              + (equipped.waist ? (equipped.waist.defense_augmented ? equipped.waist.defense_augmented : 0) : 0)
                              + (equipped.legs ? (equipped.legs.defense_augmented ? equipped.legs.defense_augmented : 0) : 0) 
                              + (equipped.weapon ? (equipped.weapon.defense ? equipped.weapon.defense : 0) : 0)}
          </p>
          {Object.keys(skills).length > 0 ?
            <div>
              <b>Skills</b>:
                <ul>
                  {Object.entries(skills).map(([k,v], i) => <li key={i}>{k} level {v.level} <span className="float-end">{v.cap}*</span></li>)}
                </ul>
                <b>*Numbers on right are level cap</b>
            </div>
          : null}
        </div>
      </div>
      {equipped.weapon.attack && equipped.head.defense_base && equipped.chest.defense_base && equipped.gloves.defense_base && equipped.waist.defense_base && equipped.legs.defense_base
      ? <div className="row">
          <div className="col-sm-3">
            <Form>
              <h6 className="my-2">Level 1 Decorations <br/>({decoSlots["1"] - maxed["1"].count} slots available)</h6>
              {gear.decorations["1"].map((d,i) => (
                <Form.Check key={i} id={`${d.id}${i}1`} className="box" type="checkbox" name="1" value={JSON.stringify(d)} label={d.name} onClick={handleCheck} disabled={maxed["1"].full && !document.getElementById(`${d.id}${i}1`).checked ? true : false} /> 
              ))}
            </Form>
          </div>
          <div className="col-sm-3">
            <Form>
              <h6 className="my-2">Level 2 Decorations <br/>({decoSlots["2"] - maxed["2"].count} slots available)</h6>
              {gear.decorations["2"].map((d,i) => (
                <Form.Check key={i} id={`${d.id}${i}2`} className="box" type="checkbox" name="2" value={JSON.stringify(d)} label={d.name} onClick={handleCheck} disabled={maxed["2"].full && !document.getElementById(`${d.id}${i}2`).checked ? true : false} /> 
              ))}
            </Form>
          </div>
          <div className="col-sm-3">
            <Form>
              <h6 className="my-2">Level 3 Decorations <br/>({decoSlots["3"] - maxed["3"].count} slots available)</h6>
              {gear.decorations["3"].map((d,i) => (
                <Form.Check key={i} id={`${d.id}${i}3`} className="box" type="checkbox" name="3" value={JSON.stringify(d)} label={d.name} onClick={handleCheck} disabled={maxed["3"].full && !document.getElementById(`${d.id}${i}3`).checked ? true : false} /> 
              ))}
            </Form>
          </div>
          <div className="col-sm-3">
            <Form>
              <h6 className="my-2">Level 4 Decorations <br/>({decoSlots["4"] - maxed["4"].count} slots available)</h6>
              {gear.decorations["4"].map((d,i) => (
                <Form.Check key={i} id={`${d.id}${i}4`} className="box" type="checkbox" name="4" value={JSON.stringify(d)} label={d.name} onClick={handleCheck} disabled={maxed["4"].full && !document.getElementById(`${d.id}${i}4`).checked ? true : false} /> 
              ))}
            </Form> 
          </div>
        </div>
      : <h2 className="my-4">Select weapon + armor to gain access to decoration slots</h2>}
    </div>
  )
}

export default GearingPage;