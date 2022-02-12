"use strict"

const axios = require("axios");
const url = "https://mhw-db.com";
const Armorset = require("../models/armorset")
const Armor = require("../models/armor");
const Monster = require("../models/monster");
const Local = require("../models/location");
const Item = require("../models/item");
const Skill = require("../models/skill");
const Ailment = require("../models/ailment");
const Charm = require("../models/charm");
const Weapon = require("../models/weapon");
const Decoration = require("../models/decoration");

const getData = async () => {
  await Promise.all([
    getSkills(), 
    getItems(), 
    getLocations(), 
    getArmorSets(), 
    getAilments()
  ]);
  getMonsters();
  getCharms();
  getArmor();
  getDecorations();
  getWeapons();
}

const getSkills = async () => {
  const res = await axios.get(`${url}/skills`);
  const skills = res.data;
  skills.map(s => {
    s.ranks.map(r => {
      Skill.create(r.id, `${s.name} ${r.level}`, r.level, r.description)
    })
  })
}

const getItems = async () => {
  const res = await axios.get(`${url}/items`);
  const items = res.data;
  items.map(i => {
    Item.create(i.id, i.name, i.description, i.rarity, i.carryLimit, i.value);
  })
}

const getArmorSets = async () => {
  const res = await axios.get(`${url}/armor/sets`);
  const sets = res.data;
  await sets.map(s => {
    // TODO fix duplication error?
    Armorset.create(s.id, s.name, s.rank, s.bonus ? s.bonus.name : null);
  });
  const bonusSets = sets.filter(s => !s.bonus ? false : true);
  bonusSets.map(s => {
    s.bonus.ranks.map(r =>{
      Armorset.createSkill(s.id, r.skill.id, r.pieces)
    })
  })
}

const getArmor = async () => {
  const res = await axios.get(`${url}/armor`);
  const armor = res.data;
  await armor.map(a => {
    if (!a.assets) {
      if (a.type === `head`) {a.assets = {
        "imageMale": `https://assets.mhw-db.com/armor/9e9e2c421697e3deb8fc8d362a7f2b8f911fa511.7284b9666abcf7560ace82a4e4a72f1d.png`, 
        "imageFemale": `https://assets.mhw-db.com/armor/a30d7cf3ff696e07e746aeed1f593a90648a435f.a9ff8627de743cb13e3b1fe48461ec0f.png`
      }};
      if (a.type === `chest`){a.assets = {
        "imageMale": `https://assets.mhw-db.com/armor/31274503eeadb6cb37266a2f578db8c92456a984.70b16041b1e6483321cdd0ad72e8ce6f.png`, 
        "imageFemale": `https://assets.mhw-db.com/armor/fba000594549191b0913b4c839c59fbb82e68aad.3de50440c16c93ece97a084352db1b1b.png`
      }};
      if (a.type === `gloves`){a.assets = {
        "imageMale": `https://assets.mhw-db.com/armor/81dd76d98cd3495e839c7e908bb9219ad3c90a69.177e947ec9ad9ba9148e94390b1e2015.png`, 
        "imageFemale": `https://assets.mhw-db.com/armor/f3abd35ffa744cb303288816fca163fb96ded57b.97c6607729b27375cd0428fc2f4ae96f.png`
      }};
      if (a.type === `waist`){a.assets = {
        "imageMale": `https://assets.mhw-db.com/armor/9f04b4887ee16b009d6403a676b73b79c51ee191.ef72cb09966c41a20ef3dbea3797f081.png`, 
        "imageFemale": `https://assets.mhw-db.com/armor/57007ad399fb917a5bf35606b2c4af4ee5db0183.08a38f727ca1cb97d0fbfd02f6ab49cf.png`
      }};
      if (a.type === `legs`){a.assets = {
        "imageMale": `https://assets.mhw-db.com/armor/c5c55c125f9ac5c9c2e074fcf171bdffd20af8e9.f428ae0c7a70bdccec78a78641054669.png`, 
        "imageFemale": `https://assets.mhw-db.com/armor/abd6311f80de140f81ce35cedd1bd77e3ed59c2b.fc369c2cc3a71c4638bdeecf13643b00.png`
      }};
    };
    if (a.slots.length === 0) a.slots = {1: null, 2: null, 3: null};
    if (a.slots.length === 1) a.slots = {1: a.slots[0].rank, 2: null, 3: null};
    if (a.slots.length === 2) a.slots = {1: a.slots[0].rank, 2: a.slots[1].rank, 3: null};
    if (a.slots.length === 3) a.slots = {1: a.slots[0].rank, 2: a.slots[1].rank, 3: a.slots[2].rank};
    Armor.create(a.id, a.name, a.type, a.rank, a.slots, a.rarity, a.defense.base, a.defense.max, a.defense.augmented, a.armorSet.id, a.assets.imageMale, a.assets.imageFemale);
  });
  const armorWithSkills = armor.filter(a => a.skills.length > 0 ? true : false)
  armorWithSkills.map(a => {
    a.skills.map(s => {
      Armor.createSkill(a.id, s.id)
    })
  })
  const armorWithMaterials = armor.filter(a => a.crafting.materials.length > 0 ? true : false)  
  armorWithMaterials.map(a => {
    a.crafting.materials.map(m => {
      Armor.createMaterial(a.id, m.item.id, m.quantity)
    })
  })
}

const getMonsters = async () => {
  const res = await axios.get(`${url}/monsters`);
  const monsters = res.data;
  await Promise.all(monsters.map(async m => {
    await Monster.create(m.id, m.name, m.type, m.species, m.description);
    m.locations.map(l => {
      Monster.createLocation(m.id, l.id)
    });
    m.weaknesses.map(w => {
      if (!w.condition) w.condition = "always"
      Monster.createWeakness(m.id, w.element, w.stars, w.condition)
    });
    m.ailments.map(a => {
      Monster.createAilment(m.id, a.id)
    });
  }));
  const monstersWithMaterials = monsters.filter(a => a.rewards.length > 0 ? true : false);
  monstersWithMaterials.map(m => {
    m.rewards.map(r => {
      Monster.createMaterial(r.id, m.id, r.item.id);
      r.conditions.map(c => {
        Monster.createConditions(r.id, c.type, c.rank, c.quantity, c.chance, c.subtype)
      })
    })
  })
}

const getLocations = async () => {
  const res = await axios.get(`${url}/locations`);
  const locations = res.data;
  locations.map(i => {
    Local.create(i.id, i.name, i.zoneCount, JSON.stringify(i.camps));
  })
}

const getAilments = async () => {
  const res = await axios.get(`${url}/ailments`);
  const ailments = res.data;
  ailments.map(a => {
    Ailment.create(a.id, a.name, a.description);
  })
}

const getCharms = async () => {
  const res = await axios.get(`${url}/charms`);
  const charms = res.data;
  charms.map(c => {
    c.ranks.map(r => {
      const charmId = Number(String(c.id) + String(r.level));
      Charm.create(charmId, r.name, r.level, r.rarity, r.crafting.craftable);
      r.skills.map(async s => {
        Charm.createSkill(charmId, s.id);
      });
      r.crafting.materials.map(m => {
        Charm.createMaterial(charmId, m.item.id, m.quantity)
      })
    })
  })
}

const getDecorations = async () => {
  const res = await axios.get(`${url}/decorations`);
  const decorations = res.data;
  decorations.map(d => {
    Decoration.create(d.id, d.name, d.rarity, d.slot);
    d.skills.map(s => {
      Decoration.createSkill(d.id, s.id)
    })
  })
}

const getWeapons = async () => {
  const res = await axios.get(`${url}/weapons`);
  const weapons = res.data;
  weapons.map(w => {
    if (!w.assets) w.assets = {image: null};
    if (w.slots.length === 0) w.slots = {1: null, 2: null, 3: null};
    if (w.slots.length === 1) w.slots = {1: w.slots[0].rank, 2: null, 3: null};
    if (w.slots.length === 2) w.slots = {1: w.slots[0].rank, 2: w.slots[1].rank, 3: null};
    if (w.slots.length === 3) w.slots = {1: w.slots[0].rank, 2: w.slots[1].rank, 3: w.slots[2].rank};
    if (!w.attributes.affinity) w.attributes.affinity = 0;
    if (!w.attributes.defense) w.attributes.defense = 0;
    const sharp = [];
    if (w.durability) {
      w.durability.map(d => sharp.push(d.white));
    }
    if (w.phial) {
      Weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw,
        w.attributes.affinity,
        w.attributes.defense,
        w.damageType,
        w.slots,
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
      Weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw,
        w.attributes.affinity,
        w.attributes.defense,
        w.damageType,
        w.slots,
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
      Weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw,
        w.attributes.affinity,
        w.attributes.defense,
        w.damageType,
        w.slots,
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
      Weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw,
        w.attributes.affinity,
        w.attributes.defense,
        w.damageType,
        w.slots,
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
      Weapon.create(
        w.id, 
        w.name, 
        w.type, 
        w.attack.raw,
        w.attributes.affinity,
        w.attributes.defense,
        w.damageType,
        w.slots,
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
        Weapon.createAmmo(w.id, a.type, a.capacities)
      })
    };
    if (w.crafting.craftingMaterials.length > 0) {
      w.crafting.craftingMaterials.map(c => {
        Weapon.createMaterial(w.id, c.item.id, "craft", c.quantity)
      })
    };
    if (w.crafting.upgradeMaterials.length > 0) {
      w.crafting.upgradeMaterials.map(c => {
        Weapon.createMaterial(w.id, c.item.id, "upgrade", c.quantity)
      })
    }
  });
  const weaponWithElements = weapons.filter(w => w.elements.length > 0 ? true : false);
  weaponWithElements.map(w => {
    w.elements.map(e => {
      Weapon.createElement(w.id, e.type, e.damage, e.hidden);
    })
  })
}

// TODO setTimeout(function(){method()}, 2*1000)

module.exports = getData;