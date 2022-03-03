"use strict";

const { BadRequestError, NotFoundError } = require("../expressError");
const db = require("../db.js");
const Skill = require("./skill");
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
  const newSkill = {
    id: 3,
    name: "test",
    level: 3,
    description: "testdes",
    cap: 3
  };

  test("works", async () => {
    await Skill.create(newSkill.id, newSkill.name, newSkill.level, newSkill.description, newSkill.cap);
    const res = await db.query(`SELECT * FROM skills WHERE id = $1`, [newSkill.id]);
    const skill = res.rows[0];
    expect(skill).toEqual({
      ...newSkill
    })
  })
});

describe("findAll", () => {
  test("works", async () => {
    const skills = await Skill.findAll();
    expect(skills).toEqual([
      {
        id: 1,
        name: "s1",
        level: 1,
        description: "tests1",
        cap: 1
      },
      {
        id: 2,
        name: "s2",
        level: 2,
        description: "tests2",
        cap: 2
      }
    ])
  })
});

describe("findSkill", () => {
  const id = 1;

  test("works", async () => {
    const skill = await Skill.findSkill(id);
    expect(skill).toEqual({
      id: 1,
      name: "s1",
      level: 1,
      description: "tests1",
      cap: 1
    })
  });

  test("not found", async () => {
    try {
      await Skill.findSkill(9999999);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  })
});

describe("findArmorSets", () => {
  const id = 1;

  test("works", async () => {
    const armorSets = await Skill.findArmorSets(id);
    expect(armorSets).toEqual([{
      id: 1, 
      name: "as1",
      pieces: 1
    }])
  });

  test("not found", async () => {
    const armorSets = await Skill.findArmorSets(9999999);
    expect(armorSets).toEqual([])
  });
});

describe("findArmor", () => {
  const id = 1;

  test("works", async () => {
    const armor = await Skill.findArmor(id);
    expect(armor).toEqual([{
      id: 1, 
      name: "a1",
      m_img: "testa1m",
      f_img: "testa1f"
    }])
  });

  test("not found", async () => {
    const armor = await Skill.findArmor(9999999);
    expect(armor).toEqual([])
  });
});

describe("findCharms", () => {
  const id = 1;

  test("works", async () => {
    const charms = await Skill.findCharms(id);
    expect(charms).toEqual([{
      id: 1, 
      name: "c1",
      level: 1,
      rarity: 1
    }])
  });

  test("not found", async () => {
    const charms = await Skill.findCharms(9999999);
    expect(charms).toEqual([])
  });
});

describe("findDecos", () => {
  const id = 1;

  test("works", async () => {
    const decorations = await Skill.findDecos(id);
    expect(decorations).toEqual([{
      id: 1, 
      name: "d1",
      rarity: 1,
      slot: 1
    }])
  });

  test("not found", async () => {
    const decorations = await Skill.findDecos(9999999);
    expect(decorations).toEqual([])
  });
});