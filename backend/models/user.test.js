"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", () => {
  test("works", async () => {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      email: "u1@email.com",
      isAdmin: false,
    });
  });

  test("unauth if no such user", async () => {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async () => {
    try {
      await User.authenticate("c1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", () => {
  const newUser = {
    username: "new",
    email: "test@test.com",
    isAdmin: false,
  };

  test("works", async () => {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async () => {
    let user = await User.register({
      ...newUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toEqual({ ...newUser, isAdmin: true });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async () => {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", () => {
  test("works", async () => {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "u1",
        email: "u1@email.com",
        isAdmin: false,
      },
      {
        username: "u2",
        email: "u2@email.com",
        isAdmin: false,
      },
    ]);
  });
});

/************************************** get */

describe("get", () => {
  test("works", async () => {
    let user = await User.get("u1");
    expect(user).toEqual({
      username: "u1",
      email: "u1@email.com",
      isAdmin: false,
      armor: [1, 2, 3, 4],
      weapons: [1],
      charms: [1],
      decorations: {1:1},
      monsters: [1]
    });
  });

  test("not found if no such user", async () => {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// *********************** getAll
describe("getAll", () => {
  test("works", async () => {
    let user = await User.getAll("u1");
    expect(user).toEqual({
      username: "u1",
      email: "u1@email.com",
      armor: [
        {
          id: 1,
          name: "a1",
          f_img: "testa1f",
          m_img: "testa1m"
        },
        {
          id: 2,
          name: "a2",
          f_img: "testa2f",
          m_img: "testa2m"
        },
        {
          id: 3,
          name: "a3",
          f_img: "testa3f",
          m_img: "testa3m"
        },
        {
          id: 4,
          name: "a4",
          f_img: "testa4f",
          m_img: "testa4m"
        }
      ],
      weapons: [{
        id: 1,
        name: "w1",
        img: "http://w1.img"
      }],
      charms: [{
        id: 1,
        name: "c1",
        level: 1,
        rarity: 1
      }],
      decorations: [{
        id: 1,
        name: "d1",
        rarity: 1,
        slot: 1,
        count: "1"
      }],
      monsters: [{
        id: 1,
        name: "m1",
        icon: "http://m1.icon"
      }]
    });
  });

  test("not found if no such user", async () => {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// ****************** getGear 

describe("getGear", () => {
  test("works", async () => {
    let user = await User.getGear("u1");
    expect(user).toEqual({
      head: [{
        id: 1,
        name: "a1",
        defense_base: 1,
        defense_max: 1,
        defense_augmented: 1,
        slots: {1:1, 2:1, 3:1, 4:1}
      }],
      chest: [{
        id: 2,
        name: "a2",
        defense_base: 2,
        defense_max: 2,
        defense_augmented: 2,
        slots: {1:1, 2:1, 3:1, 4:1}
      }],
      gloves: [{
        id: 3,
        name: "a3",
        defense_base: 3,
        defense_max: 3,
        defense_augmented: 3,
        slots: {1:1, 2:1, 3:1, 4:1}
      }],
      waist: [{
        id: 4,
        name: "a4",
        defense_base: 4,
        defense_max: 4,
        defense_augmented: 4,
        slots: {1:1, 2:1, 3:1, 4:1}
      }],
      legs: [],
      weapons: [{
        id: 1,
        name: "w1",
        type: "great-sword",
        attack: 1,
        affinity: 1,
        defense: 1,
        damage_type: "testdmg1",
        elderseal: "testseal1",
        white_sharpness: [1],
        coatings: null,
        phial_type: null,
        phial_damage: null,
        shelling_type: null,
        shelling_level:null,
        boost_type: null,
        special_ammo: null,
        deviation: null,
        element: ["fire"],
        element_damage: [1],
        hidden: [true],
        ammo_types: null,
        slots: {1:1}
      }],
      charms: [{
        id: 1,
        name: "c1",
        skill_caps: [1],
        skills: ["s1"]
      }],
      decorations: {
        1: [{
          id: 1,
          name: "d1",
          skill_caps: [1],
          skills: ["s1"],
          slot: 1
        }],
        2: [],
        3: [],
        4: []
      }
    });
  });

  test("not found if no such user", async () => {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", () => {
  const updateData = {
    email: "new@email.com",
    isAdmin: true,
  };

  test("works", async () => {
    let job = await User.update("u1", updateData);
    expect(job).toEqual({
      username: "u1",
      ...updateData,
    });
  });

  test("works: set password", async () => {
    let job = await User.update("u1", {
      password: "new",
    });
    expect(job).toEqual({
      username: "u1",
      email: "u1@email.com",
      isAdmin: false,
    });
    const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async () => {
    try {
      await User.update("nope", {
        email: "new@gmail.com",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async () => {
    expect.assertions(1);
    try {
      await User.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", () => {
  test("works", async () => {
    await User.remove("u1");
    const res = await db.query(
        "SELECT * FROM users WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async () => {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});