"use strict";

const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken
} = require("./_testCommon");
const { test, expect } = require("@jest/globals");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /skills", () => {
  const skills = [
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
  ];

  test("ok for user", async () => {
    const res = await request(app).get("/skills").set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(skills)
  });

  test("ok for admin", async () => {
    const res = await request(app).get("/skills").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(skills)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get("/skills");
    expect(res.statusCode).toEqual(401);
  })
});

describe("GET /skills/:id", () => {
  const id = 1;
  const skill = {
    id: 1,
    name: "s1",
    level: 1,
    description: "tests1",
    cap: 1,
    armorSets: [{
      id: 1, 
      name: "as1",
      pieces: 1
    }],
    armor: [{
      id: 1, 
      name: "a1",
      m_img: "testa1m",
      f_img: "testa1f"
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
      slot: 1
    }]
  };

  test("ok for users", async () => {
    const res = await request(app).get(`/skills/${id}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual(skill)
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/skills/${id}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual(skill)
  });

  test("not found for no skill id", async function () {
    const res = await request(app).get(`/skills/9999`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/skills/${id}`);
    expect(res.statusCode).toEqual(401);
  })
});