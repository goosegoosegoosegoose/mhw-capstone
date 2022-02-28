"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Armor = require("./armor");
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
  let newArmor = {
    id: 6, 
    name: "a6", 
    type: "head",
    rank: "testrank6", 
    slots: {1:1, 2:0, 3:0, 4:1}, 
    rarity: 6, 
    defense_base: 6, 
    defense_max: 6, 
    defense_augmented: 6, 
    armor_set_id: 2, 
    m_img: "testa6m", 
    f_img: "testa6f" 
  };

  test("works", async () => {
    await Armor.create(newArmor.id, newArmor.name, newArmor.type, newArmor.rank, newArmor.slots, newArmor.rarity, newArmor.defense_base, newArmor.defense_max, newArmor.defense_augmented, newArmor.armor_set_id, newArmor.m_img, newArmor.f_img);
    let res = await db.query(`SELECT * FROM armor WHERE id = $1`, [newArmor.id]);
    let armor = res.rows[0];
    expect(armor).toEqual({
      ...newArmor,
      // id: expect.any(Number),
    });
  });

});

describe("createSkill", () => {
  let newArmorSkill = {
    armor_id: 3,
    skill_id: 2
  };

  test("works", async () => {
    await Armor.createSkill(newArmorSkill.armor_id, newArmorSkill.skill_id);
    let res = await db.query(`SELECT * FROM armor_skills WHERE armor_id = $1 AND skill_id = $2`, [newArmorSkill.armor_id, newArmorSkill.skill_id]);
    let armorSkill = res.rows[0];
    expect(armorSkill).toEqual({
      ...newArmorSkill,
      id: expect.any(Number)
    });
  });
});

describe("createMaterial", () => {
  let newArmorMaterial = {
    armor_id: 3,
    item_id: 2,
    quantity: 3
  };

  test("works", async () => {
    await Armor.createMaterial(newArmorMaterial.armor_id, newArmorMaterial.item_id, newArmorMaterial.quantity);
    let res = await db.query(`SELECT * FROM armor_materials WHERE armor_id = $1 AND item_id = $2`, [newArmorMaterial.armor_id, newArmorMaterial.item_id]);
    let armorMaterial = res.rows[0];
    expect(armorMaterial).toEqual({
      ...newArmorMaterial,
      id: expect.any(Number),
    });
  });

  test("duplicate armor material", async () => {
    try {
      await Armor.createMaterial(newArmorMaterial.armor_id, newArmorMaterial.item_id, newArmorMaterial.quantity);
      await Armor.createMaterial(newArmorMaterial.armor_id, newArmorMaterial.item_id, newArmorMaterial.quantity);
      fail();
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});


describe("findAll", () => {
  test("works", async () => {
    const armor = await Armor.findAll();
    expect(armor).toEqual([
      {
        id: 1,
        name: "a1",
        m_img: "testa1m",
        f_img: "testa1f"
      },
      {
        id: 2,
        name: "a2",
        m_img: "testa2m",
        f_img: "testa2f"
      },
      {
        id: 3,
        name: "a3",
        m_img: "testa3m",
        f_img: "testa3f"
      },
      {
        id: 4,
        name: "a4",
        m_img: "testa4m",
        f_img: "testa4f"
      },
      {
        id: 5,
        name: "a5",
        m_img: "testa5m",
        f_img: "testa5f"
      }
    ])
  });

  test("filter name", async () => {
    const name = "a2"
    const armor = await Armor.findAll({name: name});
    expect(armor).toEqual([
      {
        id: 2,
        name: "a2",
        m_img: "testa2m",
        f_img: "testa2f"
      }
    ])
  });

  test("filter type", async () => {
    const type = "head"
    const armor = await Armor.findAll({type: type});
    expect(armor).toEqual([
      {
        id: 1,
        name: "a1",
        m_img: "testa1m",
        f_img: "testa1f"
      }
    ])
  });

  test("filter rank", async () => {
    const rank = "testranka3"
    const armor = await Armor.findAll({rank: rank});
    expect(armor).toEqual([
      {
        id: 3,
        name: "a3",
        m_img: "testa3m",
        f_img: "testa3f"
      }
    ])
  });

  test("filter rarity", async () => {
    const rarity = 4
    const armor = await Armor.findAll({rarity: rarity});
    expect(armor).toEqual([
      {
        id: 4,
        name: "a4",
        m_img: "testa4m",
        f_img: "testa4f"
      }
    ])
  });
});

describe("findArmor", () => {
  test("works", async () => {
    const id = 1;
    let armor = await Armor.findArmor(id);
    expect(armor).toEqual({
      id: 1, 
      name: "a1",
      type: "head", 
      rank: "testranka1",
      slots: {1:1, 2:1, 3:1, 4:1},
      rarity: 1, 
      defense_base: 1, 
      defense_max: 1, 
      defense_augmented: 1, 
      armor_set_id: 1,
      m_img: "testa1m", 
      f_img: "testa1f"
    })
  });

  test("not found", async () => {
    try {
      await Armor.findArmor(9999999);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("findArmorSet", () => {
  test("works", async () => {
    const id = 1;
    let armorSet = await Armor.findArmorSet(id);
    expect(armorSet).toEqual({
      id: 1, 
      name: "as1"
    })
  });

  test("not found", async () => {
    try {
      await Armor.findArmorSet(9999999);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("findArmorSkills", () => {
  test("works", async () => {
    const id = 1;
    let armorSkills = await Armor.findSkills(id);
    expect(armorSkills).toEqual([{
      id: 1, 
      name: "s1"
    }])
  });

  test("not found", async () => {
    const armorSkills = await Armor.findSkills(9999999);
    expect(armorSkills).toEqual([]);
  });
});

describe("findArmorMaterials", () => {
  test("works", async () => {
    const id = 1;
    let armorMaterials = await Armor.findMaterials(id);
    expect(armorMaterials).toEqual([{
      id: 1, 
      material: "i1",
      quantity: 1,
      description: "testi1"
    }])
  });

  test("not found", async () => {
    const armorMaterials = await Armor.findMaterials(9999999);
    expect(armorMaterials).toEqual([]);
  });
});

describe("userAdd", () => {
  let username = "u1"
  let armor_id = 5;

  test("works", async () => {
    await Armor.userAdd(username, armor_id);
    let res = await db.query(`SELECT * FROM user_armor WHERE username = $1 AND armor_id = $2`, [username, armor_id]);
    let armor = res.rows;
    expect(armor).toEqual([
      {
        id: expect.any(Number),
        username: username,
        armor_id: armor_id,
        slots: {1:1, 2:1, 3:1, 4:1}
      }
    ])
  });

  test("user not found", async () => {
    try {
      await Armor.userAdd("nope", armor_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });

  test("duplicate user armor", async () => {
    try {
      await Armor.userAdd(username, 1);
      fail()
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy()
    }
  })
})

describe("userRemove", () => {
  let username = "u1"
  let armor_id = 1;

  test("works", async () => {
    await Armor.userRemove(username, armor_id);
    let res = await db.query(`SELECT * FROM user_armor WHERE username = $1 AND armor_id = $2`, [username, armor_id]);
    expect(res.rows.length).toEqual(0);
  });

  test("user not found", async () => {
    try {
      await Armor.userRemove("nope", armor_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });
})