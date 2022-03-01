"use strict";

const { NotFoundError } = require("../expressError");
const db = require("../db.js");
const ArmorSet = require("./armorset");
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
  let newArmorSet = {
    id: 3, 
    name: "as3", 
    rank: "test",
    set_bonus: 'testbonusas3'
  };

  test("works", async () => {
    await ArmorSet.create(newArmorSet.id, newArmorSet.name, newArmorSet.rank, newArmorSet.set_bonus);
    let res = await db.query(`SELECT * FROM armor_sets WHERE id = $1`, [newArmorSet.id]);
    let armorSet = res.rows[0];
    expect(armorSet).toEqual({
      ...newArmorSet
    });
  });

  // test("duplicate armor", async () => {
  //   try {
  //     await ArmorSet.create(newArmorSet.id, newArmorSet.name, newArmorSet.rank, newArmorSet.set_bonus);
  //     await ArmorSet.create(newArmorSet.id, newArmorSet.name, newArmorSet.rank, newArmorSet.set_bonus);
  //     fail();
  //   } catch (e) {
  //     expect(e instanceof BadRequestError).toBeTruthy();
  //   }
  // });
});

describe("createSkill", () => {
  let newSetSkill = {
    armor_set_id: 3,
    skill_id: 2,
    pieces: 4
  };

  test("works", async () => {
    await ArmorSet.createSkill(newSetSkill.armor_set_id, newSetSkill.skill_id, newSetSkill.pieces);
    let res = await db.query(`SELECT * FROM set_skills WHERE armor_set_id = $1 AND skill_id = $2`, [newSetSkill.armor_set_id, newSetSkill.skill_id]);
    let setSkill = res.rows[0];
    expect(setSkill).toEqual({
      ...newSetSkill,
      id: expect.any(Number)
    });
  });

  // test("duplicate armor skill", async () => {
  //   try {
  //     await ArmorSet.createSkill(newSetSkill.armor_set_id, newSetSkill.skill_id, newSetSkill.pieces);
  //     await ArmorSet.createSkill(newSetSkill.armor_set_id, newSetSkill.skill_id, newSetSkill.pieces);
  //     fail();
  //   } catch (e) {
  //     expect(e instanceof BadRequestError).toBeTruthy();
  //   }
  // });
});

describe("findAll", () => {
  test("works", async () => {
    const armorSets = await ArmorSet.findAll();
    expect(armorSets).toEqual([
      {
        id: 1,
        name: "as1",
        rank: "testrank1",
        set_bonus: "testbonusas1",
        total_base: "15",
        total_max: "15",
        total_augmented: "15"
      },
      {
        id: 2,
        name: "as2",
        rank: "testrank2",
        set_bonus: "testbonusas2",
        total_augmented: "7",
        total_base: "7",
        total_max: "7"
      }
    ])
  });
});

describe("findArmorSet", () => {
  const id = 1;

  test("works", async () => {
    let armorSet = await ArmorSet.findArmorSet(id);
    expect(armorSet).toEqual({
        id: 1,
        name: "as1",
        rank: "testrank1",
        set_bonus: "testbonusas1",
        total_base: "15",
        total_max: "15",
        total_augmented: "15"
      })
  });

  test("not found", async () => {
    try {
      await ArmorSet.findArmorSet(9999999);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("findSkills", () => {
  const id = 1;

  test("works", async () => {
    let setSkills = await ArmorSet.findSkills(id);
    expect(setSkills).toEqual([{
      id: 1, 
      name: "s1",
      level: 1,
      description: "tests1"
    }])
  });

  test("not found", async () => {
    let skills = await ArmorSet.findSkills(9999999);
    expect(skills).toEqual([]);
  });
});

describe("findArmor", () => {
  const id = 1;
  
  test("works", async () => {
    let setArmor = await ArmorSet.findArmor(id);
    expect(setArmor).toEqual([
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

  test("not found", async () => {
    let armor = await ArmorSet.findArmor(9999999);
    expect(armor).toEqual([]);
  });
});