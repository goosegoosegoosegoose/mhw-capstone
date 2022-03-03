"use strict";

const { BadRequestError, NotFoundError } = require("../expressError");
const db = require("../db.js");
const Charm = require("./charm")
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
  let newCharm = {
    id: 3,
    name: "test",
    level: 3,
    rarity: 3
  };

  test("works", async () => {
    await Charm.create(newCharm.id, newCharm.name, newCharm.level, newCharm.rarity);
    let res = await db.query(`SELECT * FROM charms WHERE id = $1`, [newCharm.id]);
    let charm = res.rows[0];
    expect(charm).toEqual({
      ...newCharm
    })
  })
});

describe("createSkill", () => {
  let newCharmSkill = {
    charm_id: 1,
    skill_id: 2
  };

  test("works", async () => {
    await Charm.createSkill(newCharmSkill.charm_id, newCharmSkill.skill_id);
    let res = await db.query(`SELECT * FROM charm_skills WHERE charm_id = $1 AND skill_id = $2`, [newCharmSkill.charm_id, newCharmSkill.skill_id]);
    let charmSkill = res.rows[0];
    expect(charmSkill).toEqual({
      ...newCharmSkill,
      id: expect.any(Number)
    })
  })
});

describe("createMaterial", () => {
  let newCharmMaterial = {
    charm_id: 1,
    item_id: 2,
    quantity: 4
  };

  test("works", async () => {
    await Charm.createMaterial(newCharmMaterial.charm_id, newCharmMaterial.item_id, newCharmMaterial.quantity);
    let res = await db.query(`SELECT * FROM charm_materials WHERE charm_id = $1 AND item_id = $2`, [newCharmMaterial.charm_id, newCharmMaterial.item_id]);
    let charmMaterial = res.rows[0];
    expect(charmMaterial).toEqual({
      ...newCharmMaterial,
      id: expect.any(Number)
    })
  })
});

describe("findAll", () => {
  test("works", async () => {
    const charms = await Charm.findAll();
    expect(charms).toEqual([
      {
        id: 1,
        name: "c1",
        level: 1,
        rarity: 1
      },
      {
        id: 2,
        name: "c2",
        level: 2,
        rarity: 2
      },
    ])
  })
});

describe("findCharm", () => {
  const id = 1;

  test("works", async () => {
    let charm = await Charm.findCharm(id);
    expect(charm).toEqual({
      id: 1,
      name: "c1",
      level: 1,
      rarity: 1
    })
  });

  test("not found", async () => {
    try {
      await Charm.findCharm(99999);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  })
});

describe("findSkills", () => {
  const id = 1;

  test("works", async () => {
    let charmSkills = await Charm.findSkills(id);
    expect(charmSkills).toEqual([{
      id: 1, 
      name: "s1",
      level: 1,
      description: "tests1"
    }])
  });

  test("not found", async () => {
    const charmSkills = await Charm.findSkills(9999999);
    expect(charmSkills).toEqual([]);
  });
});

describe("findMaterials", () => {
  const id = 1;

  test("works", async () => {
    let charmMaterials = await Charm.findMaterials(id);
    expect(charmMaterials).toEqual([{
      id: 1, 
      name: "i1",
      quantity: 1,
      description: "testi1"
    }])
  });

  test("not found", async () => {
    const charmMaterials = await Charm.findMaterials(9999999);
    expect(charmMaterials).toEqual([]);
  });
});

describe("userAdd", () => {
  let username = "u1"
  let charm_id = 2;

  test("works", async () => {
    await Charm.userAdd(username, charm_id);
    let res = await db.query(`SELECT * FROM user_charms WHERE username = $1 AND charm_id = $2`, [username, charm_id]);
    let charm = res.rows;
    expect(charm).toEqual([
      {
        id: expect.any(Number),
        username: username,
        charm_id: charm_id
      }
    ])
  });

  test("user not found", async () => {
    try {
      await Charm.userAdd("nope", charm_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });

  test("duplicate user charm", async () => {
    try {
      await Charm.userAdd(username, 1);
      fail()
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy()
    }
  })
});  

describe("userRemove", () => {
  let username = "u1"
  let charm_id = 1;

  test("works", async () => {
    await Charm.userRemove(username, charm_id);
    let res = await db.query(`SELECT * FROM user_charms WHERE username = $1 AND charm_id = $2`, [username, charm_id]);
    expect(res.rows.length).toEqual(0);
  });

  test("user not found", async () => {
    try {
      await Charm.userRemove("nope", charm_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });
})