"use strict"

const axios = require("axios");
const url = "https://mhw-db.com";
const armorset = require("../models/armorset")
const armor = require("../models/armor");
const monster = require("../models/monster");
const location = require("../models/location");
const item = require("../models/item");
const skill = require("../models/skill");
const ailment = require("../models/ailment")
const charm = require("../models/charm")

const getData = async () => {
  getArmorSets();
  getLocations();
  getSkills();
  getItems();
  getArmors();
  getMonsters();
  getAilments();
  getCharms();
}

const getItems = async () => {
  const res = await axios.get(`${url}/items`);
  const items = res.data;
  items.map(i => {
    item.create(i.id, i.name, i.description, i.rarity, i.carryLimit, i.value);
  })
}

const getArmorSets = async () => {
  const res = await axios.get(`${url}/armor/sets`);
  const sets = res.data;
  sets.map(s => {
    armorset.create(s.id, s.name, s.rank);
    // TODO insert bonus set skills into armorset_skills
  })
}

const getArmors = async () => {
  const res = await axios.get(`${url}/armor`);
  const armors = res.data;
  armors.map(a => {
    if (!a.assets) {
      a.assets = {"imageMale": null, "imageFemale": null}
    }
    armor.create(a.id, a.name, a.type, a.rank, a.rarity, a.defense.base, a.armorSet.id, a.assets.imageMale, a.assets.imageFemale);
    // TODO insert into armor_resistances
  })
}

const getMonsters = async () => {
  const res = await axios.get(`${url}/monsters`);
  const monsters = res.data;
  monsters.map(m => {
    monster.create(m.id, m.name, m.type, m.species, m.description);
  })
}

const getLocations = async () => {
  const res = await axios.get(`${url}/locations`);
  const locations = res.data;
  locations.map(i => {
    location.create(i.id, i.name, i.zoneCount, JSON.stringify(i.camps));
  })
}

const getSkills = async () => {
  const res = await axios.get(`${url}/skills`);
  const skills = res.data;
  skills.map(s => {
    skill.create(s.id, s.name, s.description);
    s.ranks.map(r => {
      skill.createLevel(r.id, r.skill, r.level, r.modifiers, r.description)
    })
  })
  // nested
}

const getAilments = async () => {
  const res = await axios.get(`${url}/ailments`);
  const ailments = res.data;
  ailments.map(a => {
    ailment.create(a.id, a.name, a.description);
  })
}

const getCharms = async () => {
  const res = await axios.get(`${url}/charms`);
  const charms = res.data;
  charms.map(c => {
    c.ranks.map(r => {
      const charmId = Number(String(c.id) + String(r.level));
      charm.create(charmId, r.name, r.level, r.rarity, r.crafting.craftable);
      r.skills.map(async s => {
        const level = await skill.findLevel(s.skill, s.level);
        charm.createSkill(charmId, level.id, s.level);
      });
      r.crafting.materials.map(m => {
        charm.createMaterial(charmId, m.item.id, m.quantity)
      })
    })
  })
}

// TODO setTimeout(function(){method()}, 2*1000)

module.exports = getData;