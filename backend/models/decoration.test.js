"use strict";

const { BadRequestError, NotFoundError } = require("../expressError");
const db = require("../db.js");
const Decoration = require("./decoration")
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
  const newDeco = {
    id: 3,
    name: "test",
    rarity: 3,
    slot: 3
  };

  test("works", async () => {
    await Decoration.create(newDeco.id, newDeco.name, newDeco.rarity, newDeco.slot);
    const res = await db.query(`SELECT * FROM decorations WHERE id = $1`, [newDeco.id])
    const decoration = res.rows[0];
    expect(decoration).toEqual( {
      ...newDeco
    });
  })
});

describe("createSkill", () => {
  const newDecoSkill = {
    decoration_id: 1,
    skill_id: 2
  };

  test("works", async () => {
    await Decoration.createSkill(newDecoSkill.decoration_id, newDecoSkill.skill_id);
    const res = await db.query(`SELECT * FROM decoration_skills WHERE decoration_id = $1 AND skill_id = $2`, [newDecoSkill.decoration_id, newDecoSkill.skill_id])
    const decoSkill = res.rows[0];
    expect(decoSkill).toEqual({
      ...newDecoSkill,
      id: expect.any(Number)
    })
  })
});

describe("findAll", () => {
  test("works", async () => {
    const decos = await Decoration.findAll();
    expect(decos).toEqual([
      {
        id: 1,
        name: "d1",
        rarity: 1,
        slot: 1
      },
      {
        id: 2,
        name: "d2",
        rarity: 2,
        slot: 2
      }
    ])
  })
});

describe("findDecoration", () => {
  const id = 1;

  test("works", async () => {
    const deco = await Decoration.findDecoration(id);
    expect(deco).toEqual({
      id: 1,
      name: "d1",
      rarity: 1,
      slot: 1
    })
  })

  test("not found", async () => {
    try {
      await Decoration.findDecoration(999999);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  })
});

describe("findSkills", () => {
  const id = 1;

  test("works", async () => {
    const decoSkills = await Decoration.findSkills(id);
    expect(decoSkills).toEqual([{
      id: 1,
      name: "s1",
      level: 1,
      description: "tests1"
    }])
  })

  test("not found", async () => {
    const decoSkills = await Decoration.findSkills(99999999);
    expect(decoSkills).toEqual([]);
  })
});

describe("userAdd", () => {
  const username = "u1";
  const decoration_id = 2;

  test("works", async () => {
    await Decoration.userAdd(username, decoration_id);
    const res = await db.query(`SELECT * FROM user_decorations WHERE username = $1 AND decoration_id = $2`, [username, decoration_id]);
    const decos = res.rows;
    expect(decos).toEqual([{
      id: expect.any(Number),
      username: username,
      decoration_id: decoration_id
    }])
  });

  test("works: duplicate user decoration", async () => {
    await Decoration.userAdd(username, 1);
    const res = await db.query(`SELECT * FROM user_decorations WHERE username = $1`, [username]);
    const decos = res.rows;
    expect(decos).toEqual([
      {
        id: expect.any(Number),
        username: username,
        decoration_id: 1
      },
      {
        id: expect.any(Number),
        username: username,
        decoration_id: 1
      }
    ])
  });

  test("user not found", async () => {
    try {
      await Decoration.userAdd("nope", decoration_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });

  test("decoration not found", async () => {
    try {
      await Decoration.userAdd(username, 999999);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });
});

describe("userRemove", () => {
  const username = "u1"
  const decoration_id = 1;

  test("works", async () => {
    await Decoration.userRemove(username, decoration_id);
    const res = await db.query(`SELECT * FROM user_decorations WHERE username = $1 AND decoration_id = $2`, [username, decoration_id]);
    expect(res.rows.length).toEqual(0);
  });

  test("user not found", async () => {
    try {
      await Decoration.userRemove("nope", decoration_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });

  test("decoration not found", async () => {
    try {
      await Decoration.userRemove(username, 999999);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });
})