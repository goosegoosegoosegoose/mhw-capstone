"use strict"

const axios = require("axios");
const url = "https://mhw-db.com";
const armorset = require("../models/armorset")
const armor = require("../models/armor");
const monster = require("../models/monster");
const location = require("../models/location");
const item = require("../models/item");
const skill = require("../models/skill");
const ailment = require("../models/ailment");
const charm = require("../models/charm");
const weapon = require("../models/weapon");

const getData = async () => {
  getSkills();
  getItems();
  getLocations();
  getArmorSets();
  getMonsters();
  getAilments();
  getCharms();
  getArmors();
}
// remove f_keys for everything, then reinstate in another function?

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
    if (s.bonus.id) armorset.createBonus(s.bonus.id, s.bonus.name);
    armorset.create(s.id, s.name, s.rank, s.bonus ? s.bonus.id : null);
  });
  const bonusSets = sets.filter(s => !s.bonus ? false : true);
  bonusSets.map(s => {
    s.bonus.ranks.map(r =>{
      armorset.createSkill(s.id, s.bonus.id, r.skill.id, r.pieces, r.description)
    });
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
    a.crafting.materials.map(m => {
      armor.createMaterial(a.id, m.item.id, m.quantity)
    });
    a.skills.map(s => {
      armor.createSkill(a.id, s.id)
    })
  })
}

const getMonsters = async () => {
  const res = await axios.get(`${url}/monsters`);
  const monsters = res.data;
  monsters.map(m => {
    monster.create(m.id, m.name, m.type, m.species, m.description);
    m.locations.map(l => {
      monster.createLevel(m.id, l.id)
      // test, im too tired today
    });
    m.weaknesses.map(w => {
      monster.createWeakness(m.id, w.element, w.stars, w.condition)
    });
    m.resistances.map(r => {
      monster.createResistance(m.id, r.element, r.condition)
    });
    m.ailments.map(a => {
      monster.createAilment(m.id, a.id)
    })
  })
}

const getLocations = async () => {
  const res = await axios.get(`${url}/locations`);
  const locations = res.data;
  locations.map(i => {
    location.create(i.id, i.name, i.zoneCount, JSON.stringify(i.camps));
  })
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
      r.skills.map(s => {
        charm.createSkill(charmId, s.id);
      });
      r.crafting.materials.map(m => {
        charm.createMaterial(charmId, m.item.id, m.quantity)
      })
    })
  })
}

const getWeapons = () => {
  const res = await axios.get(`${url}/weapons`);
  const weapons = res.data;
  weapons.map(w => {
    if (w.phial) {
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType, 
        w.attributes, 
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        w.durability,
        w.phial
      )
    }
    else if (w.durability) {
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType, 
        w.attributes, 
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        w.durability
      )
    };
    if (w.coatings) {
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType, 
        w.attributes, 
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        w.coatings
      )
    };
    if (w.shelling) {
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType, 
        w.attributes, 
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        w.shelling
      )      
    };
    if (w.ammo){
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType, 
        w.attributes, 
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        w.ammo
      )
    }
  })
}

// TODO setTimeout(function(){method()}, 2*1000)

module.exports = getData;