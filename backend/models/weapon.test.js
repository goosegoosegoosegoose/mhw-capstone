"use strict";

const { BadRequestError, NotFoundError } = require("../expressError");
const db = require("../db.js");
const Weapon = require("./weapon");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const { test, expect } = require("@jest/globals");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", () => {
  const newWeapon = {
    id: 100,
    name: "test",
    type: "great-sword",
    attack: 1,
    affinity: 1,
    defense: 1,
    damage_type: "testdmg",
    slots: {1:1},
    rarity: 1,
    elderseal: "testseal",
    img: "http://test.img"
  };

  test("works", async () => {
    await Weapon.create(newWeapon.id,
                        newWeapon.name,
                        newWeapon.type,
                        newWeapon.attack,
                        newWeapon.affinity,
                        newWeapon.defense,
                        newWeapon.damage_type,
                        newWeapon.slots,
                        newWeapon.rarity,
                        newWeapon.elderseal,
                        newWeapon.img,
                        newWeapon.icon);
    const res = await db.query(`SELECT * FROM weapons WHERE id = $1`, [newWeapon.id]);
    const weapon = res.rows[0];
    expect(weapon).toEqual({
      ...newWeapon
    })
  })
});

describe("updateAsset", () => {
  const newAsset = {
    id: 1,
    img: "http://newtest.img"
  };

  test("works", async () => {
    await Weapon.updateAsset(newAsset.id, newAsset.img);
    const res = await db.query(`SELECT * FROM weapons WHERE id = $1`, [newAsset.id]);
    const weapon = res.rows[0];
    expect(weapon).toEqual({
      id: 1,
      name: "w1",
      type: "great-sword",
      attack: 1,
      affinity: 1,
      defense: 1,
      damage_type: "testdmg1",
      slots: {1:1},
      rarity: 1,
      elderseal: "testseal1",
      img: "http://newtest.img"
    })
  })
});

describe("createSharpness", () => {
  const newSharpness = {
    weapon_id: 2,
    white_sharpness: [1]
  };

  test("works", async () => {
    await Weapon.createSharpness(newSharpness.weapon_id, newSharpness.white_sharpness);
    const res = await db.query(`SELECT * FROM weapon_sharpness WHERE weapon_id = $1`, [newSharpness.weapon_id]);
    const sharpness = res.rows[0];
    expect(sharpness).toEqual({
      ...newSharpness,
      id: expect.any(Number)
    })
  })
});

describe("createCoating", () => {
  const newCoating = {
    weapon_id: 1,
    coatings: ["test"]
  };

  test("works", async () => {
    await Weapon.createCoating(newCoating.weapon_id, newCoating.coatings);
    const res = await db.query(`SELECT * FROM weapon_coatings WHERE weapon_id = $1`, [newCoating.weapon_id]);
    const coating = res.rows[0];
    expect(coating).toEqual({
      ...newCoating,
      id: expect.any(Number)
    })
  })
});

describe("createPhial", () => {
  const newPhial = {
    weapon_id: 1,
    phial_type: "testphial",
    phial_damage: 1
  };

  test("works", async () => {
    await Weapon.createPhial(newPhial.weapon_id, newPhial.phial_type, newPhial.phial_damage);
    const res = await db.query(`SELECT * FROM weapon_phials WHERE weapon_id = $1`, [newPhial.weapon_id]);
    const phial = res.rows[0];
    expect(phial).toEqual({
      ...newPhial,
      id: expect.any(Number)
    })
  })
});

describe("createShelling", () => {
  const newShelling = {
    weapon_id: 1,
    shelling_type: "testshell",
    shelling_level: 1
  };

  test("works", async () => {
    await Weapon.createShelling(newShelling.weapon_id, newShelling.shelling_type, newShelling.shelling_level);
    const res = await db.query(`SELECT * FROM weapon_shelling WHERE weapon_id = $1`, [newShelling.weapon_id]);
    const shelling = res.rows[0];
    expect(shelling).toEqual({
      ...newShelling,
      id: expect.any(Number)
    })
  })
});

describe("createBoost", () => {
  const newBoost = {
    weapon_id: 1,
    boost_type: "test"
  };

  test("works", async () => {
    await Weapon.createBoost(newBoost.weapon_id, newBoost.boost_type);
    const res = await db.query(`SELECT * FROM weapon_boosts WHERE weapon_id = $1`, [newBoost.weapon_id]);
    const boost = res.rows[0];
    expect(boost).toEqual({
      ...newBoost,
      id: expect.any(Number)
    })
  })
});

describe("createGunSpec", () => {
  const newGunSpec = {
    weapon_id: 1,
    special_ammo: "testammo",
    deviation: "1"
  };

  test("works", async () => {
    await Weapon.createGunSpec(newGunSpec.weapon_id, newGunSpec.special_ammo, newGunSpec.deviation);
    const res = await db.query(`SELECT * FROM weapon_gunspecs WHERE weapon_id = $1`, [newGunSpec.weapon_id]);
    const gunspec = res.rows[0];
    expect(gunspec).toEqual({
      ...newGunSpec,
      id: expect.any(Number)
    })
  })
});

describe("createAmmo", () => {
  const newAmmo = {
    weapon_id: 1,
    ammo_type: "test",
    capacities: [1]
  };

  test("works", async () => {
    await Weapon.createAmmo(newAmmo.weapon_id, newAmmo.ammo_type, newAmmo.capacities);
    const res = await db.query(`SELECT * FROM weapon_ammo WHERE weapon_id = $1 AND ammo_type = $2`, [newAmmo.weapon_id, newAmmo.ammo_type]);
    const ammo = res.rows[0];
    expect(ammo).toEqual({
      ...newAmmo,
      id: expect.any(Number)
    })
  })
});

describe("createElement", () => {
  const newElement = {
    weapon_id: 3,
    element: "fire",
    damage: 1,
    hidden: true
  };

  test("works", async () => {
    await Weapon.createElement(newElement.weapon_id, newElement.element, newElement.damage, newElement.hidden);
    const res = await db.query(`SELECT * FROM weapon_elements WHERE weapon_id = $1 and element = $2`, [newElement.weapon_id, newElement.element]);
    const element = res.rows[0];
    expect(element).toEqual({
      ...newElement,
      id: expect.any(Number)
    })
  })
});

describe("createMaterial", () => {
  const newMaterial = {
    weapon_id: 1,
    item_id: 2,
    craft_or_upgrade: "test",
    quantity: 1
  };

  test("works", async () => {
    await Weapon.createMaterial(newMaterial.weapon_id, newMaterial.item_id, newMaterial.craft_or_upgrade, newMaterial.quantity);
    const res = await db.query(`SELECT * FROM weapon_materials WHERE weapon_id = $1 AND item_id = $2 AND craft_or_upgrade = $3`, [newMaterial.weapon_id, newMaterial.item_id, newMaterial.craft_or_upgrade]);
    const material = res.rows[0];
    expect(material).toEqual({
      ...newMaterial,
      id: expect.any(Number)
    })
  })
});

describe("findTypes", () => {


  test("works", async () => {
    const types = await Weapon.findTypes();
    expect(types).toEqual([
      {
        type: "great-sword",
        img: "http://t1.img"
      },
      {
        type: "bow",
        img: "http://t2.img"
      },
      {
        type: "switch-axe",
        img: "http://t3.img"
      },
      {
        type: "gunlance",
        img: "http://t4.img"
      },
      {
        type: "insect-glaive",
        img: "http://t5.img"
      },
      {
        type: "light-bowgun",
        img: "http://t6.img"
      }
    ])
  });

  test("filter type", async () => {
    const types = await Weapon.findTypes({type: "great-sword"});
    expect(types).toEqual([{
      type: "great-sword",
      img: "http://t1.img"
    }])
  })
});

describe("findOneType", () => {
  const type = "great-sword";

  test("works", async () => {
    const weapons = await Weapon.findOneType(type);
    expect(weapons).toEqual([
      {
        id: 1,
        name: "w1",
        img: "http://w1.img"
      },
      {
        id: 7,
        name: "w7",
        img: "http://w7.img"
      }
    ])
  });

  test("filter name", async () => {
    const weapons = await Weapon.findOneType(type, {name: "w1"});
    expect(weapons).toEqual([{
      id: 1,
      name: "w1",
      img: "http://w1.img"
    }])
  });

  test("filter elderseal", async () => {
    const weapons = await Weapon.findOneType(type, {elderseal: "testseal1"});
    expect(weapons).toEqual([{
      id: 1,
      name: "w1",
      img: "http://w1.img"
    }])
  });

  test("filter rarity", async () => {
    const weapons = await Weapon.findOneType(type, {rarity: 1});
    expect(weapons).toEqual([{
      id: 1,
      name: "w1",
      img: "http://w1.img"
    }])
  });

  test("filter bow coatings", async () => {
    const weapons = await Weapon.findOneType("bow", {coatings: "test1"});
    expect(weapons).toEqual([{
      id: 2,
      name: "w2",
      img: "http://w2.img"
    }])
  });

  test("filter switch-axe/charge-blade phial type", async () => {
    const weapons = await Weapon.findOneType("switch-axe", {phial_type: "testphial1"});
    expect(weapons).toEqual([{
      id: 3,
      name: "w3",
      img: "http://w3.img"
    }])
  });

  test("filter gunlance shelling type", async () => {
    const weapons = await Weapon.findOneType("gunlance", {shelling_type: "testshell1"});
    expect(weapons).toEqual([{
      id: 4,
      name: "w4",
      img: "http://w4.img"
    }])
  });

  test("filter insect-glaive boost type", async () => {
    const weapons = await Weapon.findOneType("insect-glaive", {boost_type: "testboost1"});
    expect(weapons).toEqual([{
      id: 5,
      name: "w5",
      img: "http://w5.img"
    }])
  });

  test("filter light-bowgun/heavy-bowgun ammo type", async () => {
    const weapons = await Weapon.findOneType("light-bowgun", {ammo_type: "testammo1"});
    expect(weapons).toEqual([{
      id: 6,
      name: "w6",
      img: "http://w6.img"
    }])
  });

  test("filter light-bowgun/heavy-bowgun special ammo", async () => {
    const weapons = await Weapon.findOneType("light-bowgun", {special_ammo: "testspecialammo1"});
    expect(weapons).toEqual([{
      id: 6,
      name: "w6",
      img: "http://w6.img"
    }])
  });

  test("filter light-bowgun/heavy-bowgun deviation", async () => {
    const weapons = await Weapon.findOneType("light-bowgun", {deviation: "testdeviation1"});
    expect(weapons).toEqual([{
      id: 6,
      name: "w6",
      img: "http://w6.img"
    }])
  })
});

describe("findWeapon", () => {
  test("works (just sharpness)", async () => {
    const id = 1;
    const weapon = await Weapon.findWeapon(id);
    expect(weapon).toEqual({
      id: 1,
      name: 'w1',
      type: 'great-sword',
      attack: 1,
      affinity: 1,
      defense: 1,
      damage_type: 'testdmg1',
      slots: {1:1},
      rarity: 1,
      elderseal: 'testseal1',
      img: 'http://w1.img',
      white_sharpness: [1]
    })
  });

  test("bow (coatings)", async () => {
    const weapon = await Weapon.findWeapon(2);
    expect(weapon).toEqual({
      id: 2,
      name: 'w2',
      type: 'bow',
      attack: 2,
      affinity: 2,
      defense:2,
      damage_type: 'testdmg2',
      slots: {1:1},
      rarity: 2,
      elderseal: 'testseal2',
      img: 'http://w2.img',
      coatings: ["test1"]
    })
  });

  test("switch-axe/charge-blade (phials + sharpness)", async () => {
    const weapon = await Weapon.findWeapon(3);
    expect(weapon).toEqual({
      id: 3,
      name: 'w3',
      type: 'switch-axe',
      attack: 3,
      affinity: 3,
      defense:3,
      damage_type: 'testdmg3',
      slots: {1:1},
      rarity: 3,
      elderseal: 'testseal3',
      img: 'http://w3.img',
      white_sharpness: [1],
      phial_type: "testphial1",
      phial_damage: 1
    })
  });

  test("gunlance (shells + sharpness)", async () => {
    const weapon = await Weapon.findWeapon(4);
    expect(weapon).toEqual({
      id: 4,
      name: 'w4',
      type: 'gunlance',
      attack: 4,
      affinity: 4,
      defense:4,
      damage_type: 'testdmg4',
      slots: {1:1},
      rarity: 4,
      elderseal: 'testseal4',
      img: 'http://w4.img',
      white_sharpness: [1],
      shelling_type: "testshell1",
      shelling_level: 1
    })
  });

  test("insect glaive (boost and sharpness)", async () => {
    const weapon = await Weapon.findWeapon(5);
    expect(weapon).toEqual({
      id: 5,
      name: 'w5',
      type: 'insect-glaive',
      attack: 5,
      affinity: 5,
      defense:5,
      damage_type: 'testdmg5',
      slots: {1:1},
      rarity: 5,
      elderseal: 'testseal5',
      img: 'http://w5.img',
      white_sharpness: [1],
      boost_type: "testboost1"
    })
  });

  test("light bowgun/heavy bowgun (ammo types, special ammo, deviation)", async () => {
    const weapon = await Weapon.findWeapon(6);
    expect(weapon).toEqual({
      id: 6,
      name: 'w6',
      type: 'light-bowgun',
      attack: 6,
      affinity: 6,
      defense:6,
      damage_type: 'testdmg6',
      slots: {1:1},
      rarity: 6,
      elderseal: 'testseal6',
      img: 'http://w6.img',
      special_ammo: "testspecialammo1",
      deviation: "testdeviation1",
      ammo: [{
        ammo_type: "testammo1",
        ammo_capacity: [1]
      }]
    })
  })

  test("not found", async () => {
    try {
      await Weapon.findWeapon(9999999);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  })
});

describe("findElements", () => {
  const id = 1;

  test("works", async () => {
    const elements = await Weapon.findElements(id);
    expect(elements).toEqual([{
      element: "fire",
      damage: 1,
      hidden: true
    }])
  });

  test("not found", async () => {
    const elements = await Weapon.findElements(9999999);
    expect(elements).toEqual([])
  })
});

describe("findMaterials", () => {
  const id = 1;

  test("works", async () => {
    const materials = await Weapon.findMaterials(id);
    expect(materials).toEqual([{
      id: 1,
      material: "i1",
      quantity: 1,
      description: "testi1"
    }])
  });

  test("not found", async () => {
    const materials = await Weapon.findMaterials(9999999);
    expect(materials).toEqual([])
  })
});

describe("userAdd", () => {
  const username = "u1";
  const weapon_id = 2;
  const slots = {1:1}

  test("works", async () => {
    await Weapon.userAdd(username, weapon_id);
    const res = await db.query(`SELECT * FROM user_weapons WHERE username = $1 AND weapon_id = $2`, [username, weapon_id]);
    const weapon = res.rows;
    expect(weapon).toEqual([{
      id: expect.any(Number),
      username: username,
      weapon_id: weapon_id,
      slots: slots
    }])
  });

  test("user not found", async () => {
    try {
      await Weapon.userAdd("nope", weapon_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });

  test("duplicate user weapon", async () => {
    try {
      await Weapon.userAdd(username, 1);
      fail()
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy()
    }
  })
});

describe("userRemove", () => {
  const username = "u1"
  const weapon_id = 1;

  test("works", async () => {
    await Weapon.userRemove(username, weapon_id);
    const res = await db.query(`SELECT * FROM user_weapons WHERE username = $1 AND weapon_id = $2`, [username, weapon_id]);
    expect(res.rows.length).toEqual(0);
  });

  test("user not found", async () => {
    try {
      await Weapon.userRemove("nope", weapon_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });
})