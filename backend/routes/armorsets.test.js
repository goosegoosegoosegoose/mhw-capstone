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

describe("GET /armorsets", () => {
  const armorSets = [
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
  ];

  test("ok for user", async () => {
    const res = await request(app).get("/armorsets").set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(armorSets)
  });

  test("ok for admin", async () => {
    const res = await request(app).get("/armorsets").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(armorSets)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get("/armorsets");
    expect(res.statusCode).toEqual(401);
  })
});

describe("GET /armorsets/:id", () => {
  const id = 1;
  const armorSet = {
    id: 1,
    name: "as1",
    rank: "testrank1",
    set_bonus: "testbonusas1",
    total_base: "15",
    total_max: "15",
    total_augmented: "15",
    skills: [{
      id: 1, 
      name: "s1",
      level: 1,
      description: "tests1"
    }],
    armor: [
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
    ]
  };

  test("ok for users", async () => {
    const res = await request(app).get(`/armorsets/${id}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual(armorSet)
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/armorsets/${id}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual(armorSet)
  });

  test("not found for no armor set id", async function () {
    const res = await request(app).get(`/armorsets/9999`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/armorsets/${id}`);
    expect(res.statusCode).toEqual(401);
  })
});