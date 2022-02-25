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
      Skill.create(r.id, `${s.name} ${r.level}`, r.level, r.description, s.ranks[s.ranks.length-1].level)
    })
  })
}

const getItems = async () => {
  const res = await axios.get(`${url}/items`);
  const items = res.data;
  items.map(i => {
    Item.create(i.id, i.name, i.description, i.rarity);
  })
}

const getArmorSets = async () => {
  const res = await axios.get(`${url}/armor/sets`);
  const sets = res.data;
  await sets.map(s => {
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
    const slots = {1: 0, 2: 0, 3: 0, 4: 0};
    for (let i=0;i<a.slots.length;i++) {
      slots[a.slots[i].rank] = slots[a.slots[i].rank] + 1
    };
    if (a.assets) {
      if (
        a.assets.imageMale === "https://assets.mhw-db.com/armor/9067d30515d01c6739160f65c680f49c12bf0c06.d20ffa258ec987a3638a7f6bb4c63761.png"
        && a.assets.imageFemale === "https://assets.mhw-db.com/armor/9067d30515d01c6739160f65c680f49c12bf0c06.d20ffa258ec987a3638a7f6bb4c63761.png"
      ) {
        delete a.assets
      }
    };
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
    Armor.create(a.id, a.name, a.type, a.rank, slots, a.rarity, a.defense.base, a.defense.max, a.defense.augmented, a.armorSet.id, a.assets.imageMale, a.assets.imageFemale);
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
  const assets = [
    {id: 1, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-aptonoth_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-aptonoth_render_001.png"},
    {id: 2, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-jagras_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-jagras_render_001.png"},
    {id: 3, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-icono_mernos.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-mernos_render_001.png"},
    {id: 4, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-vespoid_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/vespoids.png"},
    {id: 5, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-mosswine_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-mosswine_and_bristly_crake_render_001.png"},
    {id: 6, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-apceros_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-apceros_render_001.png"},
    {id: 7, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kestodon_male_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kestodon_render_001.png"},
    {id: 8, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-noios_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-noios_render_001.png"},
    {id: 9, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-gajau_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-gajau_render_001.png"},
    {id: 10, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kelbi_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kelbi_render_001.png"},
    {id: 11, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-raphinos_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-raphinos_render_001.png"},
    {id: 12, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-shamos_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-shamos_render_001.png"},
    {id: 13, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-girros_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-girros_render_001.png"},
    {id: 14, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-hornetaur_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhgen-hornetaur_render_001.png"},
    {id: 15, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-gastodon_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-gastodon_render_001.png"},
    {id: 16, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-barnos_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-barnos_render_001.png"},
    {id: 17, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-great_jagras_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-great_jagras_render_001.png"},
    {id: 18, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kulu-ya-ku_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kulu-ya-ku_render_001.png"},
    {id: 19, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-pukei-pukei_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-pukei-pukei_render_001.png"},
    {id: 20, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/MHW-Barroth_Icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-barroth_render_001.png"},
    {id: 21, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-jyuratodus_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-jyuratodus_render_001.png"},
    {id: 22, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-tobi-kadachi_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-tobi-kadachi_render_001.png"},
    {id: 23, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-anjanath_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-anjanath_render_001.png"},
    {id: 24, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-azure_rathalos_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-azure_rathalos_render_001.png"},
    {id: 25, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-bazelgeuse_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-bazelgeuse_render_001.png"},
    {id: 26, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-behemoth_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-behemoth_render_001.png"},
    {id: 27, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-deviljho_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-deviljho_render_001.png"},
    {id: 28, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-diablos_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-diablos_render_001.png"},
    {id: 29, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-black_diablos_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-black_diablos_render_001.png"},
    {id: 30, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-dodogama_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-dodogama_render_001.png"},
    {id: 31, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-great_girros_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-great_girros_render_001.png"},
    {id: 32, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kirin_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kirin_render.png"},
    {id: 33, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kulve_taroth_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kulve_taroth_render_002_(1).png"},
    {id: 34, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kushala_daora_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-kushala_daora_render_001.png"},
    {id: 35, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-lavasioth_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-lavasioth_render_001.png"},
    {id: 36, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-legiana_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-legiana_render_001.png"},
    {id: 37, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-lunastra_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-lunastra_render_001.png"},
    {id: 38, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-nergigante_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-nergigante_render_001.png"},
    {id: 39, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-odogaron_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-odogaron_render_001.png"},
    {id: 40, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-paolumu_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-paolumu_render_001.png"},
    {id: 41, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-radobaan_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-radobaan_render_001.png"},
    {id: 42, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-rathalos_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-rathalos_render_001.png"},
    {id: 43, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-rathian_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/rathian_transparent.png"},
    {id: 44, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-pink_rathian_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-pink_rathian_render_001.png"},
    {id: 45, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-teostra_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-teostra_render_001.png"},
    {id: 48, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-tzitzi-ya-ku_icon2.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-tzitzi-ya-ku_render_001.png"},
    {id: 49, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-uragaan_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-uragaan_render_001.png"},
    {id: 50, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-vaal_hazak_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-vaal_hazak_render_001.png"},
    {id: 51, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-xeno'jiiva_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-xeno'jiiva_render_001.png"},
    {id: 52, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-zorah_magdaros_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-zorah_magdaros_render_001.png"},
    {id: 53, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-leshen_icon.png", img: "https://static.wikia.nocookie.net/monsterhunter/images/0/07/MHW-Leshen_Render_001.png"},
    {id: 54, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/ancient_leshen_icon.png", img: "https://static.wikia.nocookie.net/monsterhunter/images/9/9f/MHW-Ancient_Leshen_Render_001.png"},
    {id: 55, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhwi-safi'jiiva_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhwi-safi'jiiva_render_001.png"},
    {id: 56, icon: "https://static.wikia.nocookie.net/monsterhunter/images/f/f3/MHWI-Stygian_Zinogre_Icon.png", img: "https://www.monsterhunter.com/world-iceborne/pc/topics/s-zinogre/images/img01.png"},
    {id: 57, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhwi-rajang_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhwi-rajang_render_001.png"},
    {id: 58, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/gthumbnails/mhwi-viper_tobi-kadachi_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhwi-viper_tobi-kadachi_render_001.png"},
    {id: 59, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhwi-namielle_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhwi-namielle_render_001.png"},
    {id: 60, icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhwi-zinogre_icon.png", img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhwi-zinogre_render_001.png"}
  ];
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
    assets.map(a => (
      Monster.updateAsset(a.id, a.icon, a.img)
    ))
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
  const assets = [
    {
      id: 1,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/monster-hunter-world-ancient-forest-location-information-300.jpg",
      imgs: [
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/forest_render_7.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/forest_render_1.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/forest_render_3.png"
      ]
    },
    {
      id: 2, 
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/coral-highland-monster-hunter-world-wiki-mhw-locations.jpg",
      imgs: [
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/coral_highlands_4.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/coral_highlands_5.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/coral_highlands_8.png"
      ]
    },
    {
      id: 3,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/monster-hunter-world-wildspire-waste-location-information-300.jpg",
      imgs: [
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/wildspire_5.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/wildspire_3.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/wildspire_1.png"
      ]
    },
    {
      id: 4,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/rotten-vale-monster-hunter-world-wiki-mhw-location.jpg",
      imgs: [
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/rotten_vale_3.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/rotten-vale-monster-hunter-world-guide-wiki_s.jpg",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/rotten_vale_2.png"
      ]
    },
    {
      id: 5,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/27164196_1586493168133037_8397341485490561181_o.jpg",
      imgs: [
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/elder_recess_3.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/elder_recess_6.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/elder_recess_8.png"
      ]
    },
    {
      id: 6,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/zorah-magdaros-large-monster-hunter-world-mhw.jpg",
      imgs: [
        "https://oyster.ignimgs.com/mediawiki/apis.ign.com/monster-hunter-world/5/50/Screen_Shot_2018-01-18_at_3.31.42_PM.jpg"
      ]
    },
    {
      id: 7,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/xenojiiva-monster-hunter-world-large-monster.jpg",
      imgs: [
        "https://i.pinimg.com/originals/32/e0/56/32e0567b760d3f174467eb6b28ef8adf.jpg",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/like_a_moth_to_the_flame.jpg"
      ]
    },
    {
      id: 8,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/everstream-header.jpg", 
      imgs: [
        "https://64.media.tumblr.com/4bcc292e1a052aeec133b42d65455da9/tumblr_inline_p8jdqgyH8A1s3xpsc_1280.jpg",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/zorah-magdaros-gallery.png"
      ]
    },
    {
      id: 9,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/kulve_taroth-monster-hunter-world-large-monster.jpg",
      imgs: [
        "https://cdn.guidestash.com/wp-content/uploads/2020/02/08223413/Arch-Tempered_Kulve_Taroth.jpg",
        "https://pbs.twimg.com/media/EWH2yzfWoAE6h9j.jpg"
      ]
    },
    {
      id: 10,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/special-arena-header.jpg",
      imgs: [
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/special_arena_1.png",
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/special_arena_2.png"
      ]
    },
    {
      id: 11,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/arena-header-small.jpg",
      imgs: [
        "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/large_arena.png"
      ]
    },
    {
      id: 12,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/hoarfrost_reach-mhw-wiki-guide.jpg",
      imgs: [
        "https://cdnen.samurai-gamers.com/wp-content/uploads/2019/06/18175241/hoarfrost-1024x576.jpg",
        "https://www.playstationlifestyle.net/assets/uploads/2019/06/Monster-Hunter-World-Iceborne-Trailer.jpeg",
        "https://www.monsterhunter.com/world-iceborne/assets/img/common/ecosystem/img_02_01.jpg"
      ]
    },
    {
      id: 13,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/guide-land-location-mhw-wiki-guide.jpg", 
      imgs: [
        "https://imgur.com/QfQRnHs.png",
        "https://d1lss44hh2trtw.cloudfront.net/assets/article/2020/02/19/guiding-lands-regional-monster-list-monster-hunter-world_feature.jpg",
        "https://d1lss44hh2trtw.cloudfront.net/assets/editorial/2020/01/monster-hunter-world-how-to-level-regions.jpg"
      ]
    },
    {
      id: 14,
      icon: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/origin-isle-mhw-wiki-guide.jpg",
      imgs: [
        "https://i.ytimg.com/vi/te99osdWwiw/maxresdefault.jpg",
        "https://game.capcom.com/manual/MHW_PC/img/page/49_9_1.jpg?t=20200709000000"
      ]
    }
  ]
  await locations.map(i => {
    Local.create(i.id, i.name, i.zoneCount, JSON.stringify(i.camps));
  })
  assets.map(a => {
    Local.updateAsset(a.id, a.icon, a.imgs)
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
      Charm.create(charmId, r.name, r.level, r.rarity);
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
    const slots = {1: 0, 2: 0, 3: 0, 4: 0};
    for (let i=0;i<w.slots.length;i++) {
      slots[w.slots[i].rank] = slots[w.slots[i].rank] + 1
    };
    if (!w.assets) w.assets = {image: null};
    if (!w.attributes.affinity) w.attributes.affinity = 0;
    if (!w.attributes.defense) w.attributes.defense = 0;
    if (!w.elderseal) w.elderseal = "none";
    if (w.id === 801) w.type = "charge-blade";
    if (w.assets.image === "https://assets.mhw-db.com/weapons/great-sword/9876ac2d364c5d15f019e24a8d2c08c4509015af.5e306edb643559c79313457ed6382333.png"
      || w.assets.image === "https://assets.mhw-db.com/weapons/long-sword/9706a176b1b8dd071ef33376d1c885ccdf545c19.0da7f897eddee1a6a118fbcae6135679.png"
      || w.assets.image === "https://assets.mhw-db.com/weapons/hunting-horn/26bd1eda79967525867c0a7e9a5f0be31b8f3d63.be3f00cf411ba6fc7b84a19bd46738be.png"
      || w.assets.image === "https://assets.mhw-db.com/weapons/insect-glaive/adeb5e7f179d604903c4b09cf9987f4ab010a632.119abd643a28cc9a87cbd2f74844248f.png"
      || w.assets.image === "https://assets.mhw-db.com/weapons/bow/20a9cfd9a6a80fa5666c7ab487c7422eff1d9092.05b8f5c24b77309f5fecbd97b9114c61.png"
      || w.assets.image === "https://assets.mhw-db.com/armor/9067d30515d01c6739160f65c680f49c12bf0c06.d20ffa258ec987a3638a7f6bb4c63761.png"
    ) {
      w.assets.image = null
    }
    Weapon.create(
      w.id,
      w.name,
      w.type,
      w.attack.raw,
      w.attributes.affinity,
      w.attributes.defense,
      w.damageType,
      slots,
      w.rarity, 
      w.elderseal,
      w.assets.image
    )
    const sharp = [];
    if (w.durability) {
      w.durability.map(d => sharp.push(d.white));
      Weapon.createSharpness(w.id, sharp)
    };
    if (w.coatings) Weapon.createCoating(w.id, w.coatings);
    if (w.phial) Weapon.createPhial(w.id, w.phial.type, w.phial.damage);
    if (w.shelling) Weapon.createShelling(w.id, w.shelling.type, w.shelling.level);
    if (w.boostType) Weapon.createBoost(w.id, w.boostType);
    if (w.ammo) {
      Weapon.createGunSpec(w.id, w.specialAmmo, w.deviation);
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
  });

  const assets = [
    {id: 110, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/brazenridge.png"},
    {id: 111, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/brazenridge.png"},
    {id: 169, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/azure-star-long-swords-mhw-wiki-guide.png"},
    {id: 444, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/kula_duda_i.png"},
    {id: 445, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/kula_duda_i.png"},
    {id: 446, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/kula_duda_i.png"},
    {id: 517, img: "https://assets.mhw-db.com/weapons/lance/icons/d11683d36a7bbf283e09174c108a4e18.1a9c0a53374a636bfa20c8fee128cc966d47f6ba.png"},
    {id: 519, img: "https://assets.mhw-db.com/weapons/lance/icons/d11683d36a7bbf283e09174c108a4e18.1a9c0a53374a636bfa20c8fee128cc966d47f6ba.png"},
    {id: 1180, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/wyvern_ignition_steel.png"},
    {id: 1181, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/wyvern_ignition_steel.png"},
    {id: 1188, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/empress_sword.png"},
    {id: 1191, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/azure-star-long-swords-mhw-wiki-guide.png"},
    {id: 1213, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/sapphire-star-lance-mhw-wiki-guide.png"},
    {id: 1214, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/sapphire-star-lance-mhw-wiki-guide.png"},
    {id: 1232, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/gae_bolg.png"},
    {id: 1233, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/true_gae_bolg.png"},
    {id: 1243, img: "https://static.wikia.nocookie.net/monsterhunter/images/c/ca/MHW-Bow_Render_030.png"},
    {id: 1244, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/soulfire-arch-blaze-mhw-wiki-guide.png"},
    {id: 1245, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/soulfire-arch-ruin-mhw-wiki-guide.png"},
    {id: 1246, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/soulfire-arch-styx-mhw-wiki-guide.png"},
    {id: 1247, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/tarroth-assault-glutton.png"},
    {id: 1248, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1249, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/crushergoldcannon.png"},
    {id: 1250, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1251, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/tarroth-assault-glutton.png"},
    {id: 1252, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1253, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1254, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1255, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1256, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1257, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1258, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1259, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/targoldcannon.png"},
    {id: 1260, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1261, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1264, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1265, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1266, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1267, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1268, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1269, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/targoldcannon.png"},
    {id: 1270, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1271, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1272, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1273, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1274, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1275, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1276, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1277, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1278, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1279, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_heavy_bowgun.png"},
    {id: 1281, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/devils_madness.png"},
    {id: 1282, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_longsword.png"},
    {id: 1283, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_longsword.png"},
    {id: 1284, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1285, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1286, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1287, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1288, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1289, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1290, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1291, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1292, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1293, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1294, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1295, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1296, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_dual_blade.png"},
    {id: 1297, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"},
    {id: 1298, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"},
    {id: 1299, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"},
    {id: 1300, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"},
    {id: 1301, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"},
    {id: 1302, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"},
    {id: 1303, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"},
    {id: 1304, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"},
    {id: 1305, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"},
    {id: 1306, img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/placeholder_sword_and_shield.png"}
  ];
  assets.map(a => {
    Weapon.updateAsset(a.id, a.img)
  })
}

// TODO setTimeout(function(){method()}, 2*1000)

module.exports = getData;