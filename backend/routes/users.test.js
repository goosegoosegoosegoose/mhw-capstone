"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");
const { test, expect } = require("@jest/globals");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: "new@email.com",
          isAdmin: false,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        email: "new@email.com",
        isAdmin: false,
      }, token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: "new@email.com",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "u-new",
        email: "new@email.com",
        isAdmin: true,
      }, token: expect.any(String),
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: "new@email.com",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: "new@email.com",
          isAdmin: true,
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "u-new",
          password: "password-new",
          email: "not-an-email",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

describe("GET /users", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      users: [
        {
          username: "admin",
          email: "admin@user.com",
          isAdmin: true,
        },
        {
          username: "u1",
          email: "user1@user.com",
          isAdmin: false,
        },
        {
          username: "u2",
          email: "user2@user.com",
          isAdmin: false,
        }
      ],
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/users");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

describe("GET /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        email: "user1@user.com",
        isAdmin: false,
        armor: [1,2,3,4],
        charms: [1],
        decorations:{1:1},
        monsters: [1],
        weapons: [1]
      }
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        email: "user1@user.com",
        isAdmin: false,
        armor: [1,2,3,4],
        charms: [1],
        decorations:{1:1},
        monsters: [1],
        weapons: [1]
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
        .get(`/users/u1`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
        .get(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

describe("GET /users/:username/all", () => {
  const userAll = {
    username: "u1",
    email: "user1@user.com",
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
  };

  test("ok for correct user", async () => {
    const res = await request(app).get(`/users/${userAll.username}/all`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      ...userAll
    })
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/users/${userAll.username}/all`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      ...userAll
    })
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).get(`/users/${userAll.username}/all`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).get("/users/nope/all").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
})

describe("GET /users/:username/gear", () => {
  const username = "u1";
  const userGear = {
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
  };

  test("ok for correct user", async () => {
    const res = await request(app).get(`/users/${username}/gear`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      ...userGear
    })
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/users/${username}/gear`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      ...userGear
    })
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).get(`/users/${username}/gear`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).get("/users/nope/gear").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
})


describe("PATCH /users/:username", () => {
  test("works for admins", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          email: "new@email.com",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        email: "new@email.com",
        isAdmin: false,
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          email: "new@email.com",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        email: "new@email.com",
        isAdmin: false,
      },
    });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          email: "new@email.com",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          email: "new@email.com",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
        .patch(`/users/nope`)
        .send({
          email: "nope@email.com",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          email: 42,
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          password: "new-password",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate("u1", "new-password");
    expect(isSuccessful).toBeTruthy();
  });
});



describe("DELETE /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("works for same user", async function () {
    const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
