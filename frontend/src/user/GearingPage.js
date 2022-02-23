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
  const [skills, setSkills] = useState({})


  useEffect(function fetchGearWhenMounted() {
    async function fetchGear() {
      const res = await MhwApi.getGear(username);
      setGear(res)
    }
    fetchGear()
  }, []);

  useEffect(() => {
    const one = equipped.weapon.slots["1"] + equipped.head.slots["1"] + equipped.chest.slots["1"] + equipped.gloves.slots["1"] + equipped.waist.slots["1"] + equipped.legs.slots["1"];
    const two = equipped.weapon.slots["2"] + equipped.head.slots["2"] + equipped.chest.slots["2"] + equipped.gloves.slots["2"] + equipped.waist.slots["2"] + equipped.legs.slots["2"];
    const three = equipped.weapon.slots["3"] + equipped.head.slots["3"] + equipped.chest.slots["3"] + equipped.gloves.slots["3"] + equipped.waist.slots["3"] + equipped.legs.slots["3"];
    const four = equipped.weapon.slots["4"] + equipped.head.slots["4"] + equipped.chest.slots["4"] + equipped.gloves.slots["4"] + equipped.waist.slots["4"] + equipped.legs.slots["4"];
    setDecoSlots({"1":one, "2":two, "3":three, "4":four});
  }, [equipped])

  const handleChange = evt => {
    const { name, value } = evt.target;
    setEquipped(eq => ({
      ...eq,
      [name]: JSON.parse(value)
    }));
  }

  const handleCheck = evt => {
    const {name, checked, value} = evt.target;
    const s = JSON.parse(value)
    if (checked) { 
      for (let i=0;i<s.length;i++){
        let skill = s[i].slice(0, -2);
        let level = Number(s[i].slice(-1, s[i].length));
        if (!skills[skill]) {
          setSkills(a => ({...a, [skill]: level}))
        } else {
          setSkills(a => ({...a, [skill]: skills[skill] + level}))
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
        if (skills[skill] === level) {
          delete skills[skill]
          setSkills(a => ({...a}))
        } else {
          setSkills(a => ({...a, [skill]: skills[skill] - level}))
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
      <h1>Loading..</h1>
    )
  }

  return (
    <div className="container">
      <h1 className="my-2">Mock Gearing Page</h1>
      <div className="row mt-5">
        <div className="col-sm-6">
          <Form>
            <Form.Group className="mb-2">
              <Form.Label htmlFor="weapon">Weapon</Form.Label>
              <select className="form-control" name="weapon" onChange={handleChange}>
                <option value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
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
                <option value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
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
                <option value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
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
                <option value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
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
                <option value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
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
                <option value={JSON.stringify({slots:{1: 0, 2: 0, 3: 0, 4: 0}})} defaultValue>
                  Choose chausses
                </option>
                {gear.legs.map((a,i) => 
                  <option key={i} value={JSON.stringify(a)}>{a.name}</option>
                )}
              </select>
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Label htmlFor="charm">Charm</Form.Label>
              <select className="form-control" name="charm" onChange={handleChange}>
                <option value={JSON.stringify({})} defaultValue>
                  Choose charm
                </option>
                {gear.charms.map((a,i) => 
                  <option key={i} value={JSON.stringify(a)}>{a.name}</option>
                )}
              </select>
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
            {equipped.weapon ? (equipped.weapon.white_sharpness ? <p><b>White Sharpness Values</b>: |{equipped.weapon.white_sharpness.map((s,i) => <span key={i}>|  {s}  |</span>)}| (by handicraft level left to right)</p> : null) : null}
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
                  {Object.entries(skills).map(([k,v], i) => <li key={i}>{k} level {v}</li>)}
                </ul>
            </div>
          : null}
        </div>
      </div>
      {equipped.weapon.attack && equipped.head.defense_base && equipped.chest.defense_base && equipped.gloves.defense_base && equipped.waist.defense_base && equipped.legs.defense_base
        ? <div className="row">
          {decoSlots["1"] > 0 ? 
            <div className="col-sm-3">
              <Form>
                <h6 className="my-2">Level 1 Decorations <br/>({decoSlots["1"]} slots available)</h6>
                {gear.decorations["1"].map((d,i) => (
                  <Form.Check key={i} id={i + d.id} type="checkbox" name="1" value={JSON.stringify(d.skills)} label={d.name} onClick={handleCheck} disabled={maxed["1"].full && !document.getElementById(i + d.id).checked ? true : false} /> 
                ))}
              </Form>
            </div>
          : null}
          {decoSlots["2"] > 0 ? 
            <div className="col-sm-3">
              <Form>
                <h6 className="my-2">Level 2 Decorations <br/>({decoSlots["2"]} slots available)</h6>
                {gear.decorations["2"].map((d,i) => (
                  <Form.Check key={i} id={i + d.id} type="checkbox" name="2" value={JSON.stringify(d.skills)} label={d.name} onClick={handleCheck} disabled={maxed["2"].full && !document.getElementById(i + d.id).checked ? true : false} /> 
                ))}
              </Form>
            </div>
          : null} 
          {decoSlots["3"] > 0 ? 
            <div className="col-sm-3">
              <Form>
                <h6 className="my-2">Level 3 Decorations <br/>({decoSlots["3"]} slots available)</h6>
                {gear.decorations["3"].map((d,i) => (
                  <Form.Check key={i} id={i + d.id} type="checkbox" name="3" value={JSON.stringify(d.skills)} label={d.name} onClick={handleCheck} disabled={maxed["3"].full && !document.getElementById(i + d.id).checked ? true : false} /> 
                ))}
              </Form>
            </div>
          : null}
          {decoSlots["4"] > 0 ? 
            <div className="col-sm-3">
              <Form>
                <h6 className="my-2">Level 4 Decorations <br/>({decoSlots["4"] - maxed["4"].count} slots available)</h6>
                {gear.decorations["4"].map((d,i) => (
                  <Form.Check key={i} id={i + d.id} type="checkbox" name="4" value={JSON.stringify(d.skills)} label={d.name} onClick={handleCheck} disabled={maxed["4"].full && !document.getElementById(i + d.id).checked ? true : false} /> 
                ))}
              </Form> 
            </div>
          : null} 
        </div>
      : <h2 className="my-4">Select weapon + armor to gain access to decoration slots</h2>}
    </div>
  )
}

export default GearingPage;