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
const decoration = require("../models/decoration");

const getData = async () => {
  await Promise.all([getSkills(), getItems(), getLocations(), getArmorSets(), getAilments()]);
  getMonsters();
  getCharms();
  getArmors();
  getDecorations();
  getWeapons();
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
  await sets.map(s => {
    // TODO fix duplication error?
    s.bonus ? armorset.createBonus(s.bonus.id, s.bonus.name) : null;
    armorset.create(s.id, s.name, s.rank, s.bonus ? s.bonus.id : null);
  });
  const bonusSets = sets.filter(s => !s.bonus ? false : true);
  bonusSets.map(s => {
    s.bonus.ranks.map(r =>{
      armorset.createSkill(s.id, s.bonus.id, r.skill.id, r.pieces, r.description)
    })
  })
}

const getArmors = async () => {
  const res = await axios.get(`${url}/armor`);
  const armors = res.data;
  await armors.map(a => {
    if (!a.assets) a.assets = {"imageMale": null, "imageFemale": null};
    if (a.slots.length === 0) a.slots = {};
    if (a.slots.length === 1) a.slots = {1: a.slots[0].rank};
    if (a.slots.length === 2) a.slots = {1: a.slots[0].rank, 2: a.slots[1].rank};
    if (a.slots.length === 3) a.slots = {1: a.slots[0].rank, 2: a.slots[1].rank, 3: a.slots[2].rank};
    armor.create(a.id, a.name, a.type, a.rank, a.slots, a.rarity, a.defense.base, a.armorSet.id, a.assets.imageMale, a.assets.imageFemale);
  });
  const armorWithSkills = armors.filter(a => a.skills.length > 0 ? true : false)
  armorWithSkills.map(a => {
    a.skills.map(s => {
      armor.createSkill(a.id, s.id)
    })
  })
  const armorWithMaterials = armors.filter(a => a.crafting.materials.length > 0 ? true : false)  
  armorWithMaterials.map(a => {
    a.crafting.materials.map(m => {
      armor.createMaterial(a.id, m.item.id, m.quantity)
    })
  })
}

const getMonsters = async () => {
  const res = await axios.get(`${url}/monsters`);
  const monsters = res.data;
  await Promise.all(monsters.map(async m => {
    await monster.create(m.id, m.name, m.type, m.species, m.description);
    m.locations.map(l => {
      monster.createLocation(m.id, l.id)
    });
    m.weaknesses.map(w => {
      monster.createWeakness(m.id, w.element, w.stars, w.condition)
    });
    m.resistances.map(r => {
      monster.createResistance(m.id, r.element, r.condition)
    });
    m.ailments.map(a => {
      monster.createAilment(m.id, a.id)
    });
  }));
  const monstersWithRewards = monsters.filter(a => a.rewards.length > 0 ? true : false);
  monstersWithRewards.map(m => {
    m.rewards.map(r => {
      monster.createReward(r.id, m.id, r.item.id, r.conditions)
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
      r.skills.map(async s => {
        charm.createSkill(charmId, s.id);
      });
      r.crafting.materials.map(m => {
        charm.createMaterial(charmId, m.item.id, m.quantity)
      })
    })
  })
}

const getDecorations = async () => {
  const res = await axios.get(`${url}/decorations`);
  const decorations = res.data;
  decorations.map(d => {
    decoration.create(d.id, d.name, d.rarity, d.slot);
    d.skills.map(s => {
      decoration.createSkill(d.id, s.id)
    })
  })
}

const getWeapons = async () => {
  const res = await axios.get(`${url}/weapons`);
  const weapons = res.data;
  weapons.map(w => {
    if (!w.assets) w.assets = {image: null};
    if (w.slots.length === 0) w.slots = {};
    if (w.slots.length === 1) w.slots = {1: w.slots[0].rank};
    if (w.slots.length === 2) w.slots = {1: w.slots[0].rank, 2: w.slots[1].rank};
    if (w.slots.length === 3) w.slots = {1: w.slots[0].rank, 2: w.slots[1].rank, 3: w.slots[2].rank};
    const sharp = [];
    if (w.durability) {
      w.durability.map(d => sharp.push(d.white));
    }
    if (w.phial) {
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType,
        w.slots,
        w.attributes,
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        sharp,
        null,
        w.phial,
        null,
        false,
        null,
        w.assets.image
      )
    } else if (w.shelling) {
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType,
        w.slots,
        w.attributes,
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        null,
        null,
        null,
        w.shelling,
        false,
        null,
        w.assets.image
      )      
    } else if (w.durability ) {
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType,
        w.slots,
        w.attributes,
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        sharp,
        null,
        null,
        null,
        false,
        null,
        w.assets.image
      )
    };
    if (w.coatings) {
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType,
        w.slots,
        w.attributes,
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        null,
        w.coatings,
        null,
        null,
        false,
        null,
        w.assets.image
      )
    };
    if (w.ammo){
      weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw, 
        w.damageType,
        w.slots,
        w.attributes,
        w.rarity, 
        w.elderseal, 
        w.crafting.craftable,
        null,
        null,
        null,
        null,
        true,
        w.specialAmmo,
        w.assets.image
      )
      w.ammo.map(a => {
        weapon.createAmmo(w.id, a.type, a.capacities)
      })
    };
    if (w.crafting.craftingMaterials.length > 0) {
      w.crafting.craftingMaterials.map(c => {
        weapon.createMaterial(w.id, c.item.id, "craft", c.quantity)
      })
    };
    if (w.crafting.upgradeMaterials.length > 0) {
      w.crafting.upgradeMaterials.map(c => {
        weapon.createMaterial(w.id, c.item.id, "upgrade", c.quantity)
      })
    }
  });
  const weaponWithElements = weapons.filter(w => w.elements.length > 0 ? true : false);
  weaponWithElements.map(w => {
    w.elements.map(e => {
      weapon.createElement(w.id, e.type, e.damage, e.hidden);
    })
  })
}

// TODO setTimeout(function(){method()}, 2*1000)

module.exports = getData;