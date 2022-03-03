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

describe("GET /elements", () => {
  const elements = [
    {element: 'fire', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-fire-damage.png'},
    {element: 'water', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-water-elemental-damage.png'},
    {element: 'ice', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-ice-damage.png'},
    {element: 'thunder', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-thunder-damage.png'},
    {element: 'dragon', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-dragon-damage.png'},
    {element: 'blast', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/Blastblight.png'},
    {element: 'poison', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-poison-status-effect.png'},
    {element: 'sleep', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/sleep-mhw-status-effect.png'},
    {element: 'paralysis', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/paralysis-icon.png'},
    {element: 'stun', img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-stun-status-effect.png'}
  ]

  test("ok for user", async () => {
    const res = await request(app).get("/elements").set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(elements)
  });

  test("ok for admin", async () => {
    const res = await request(app).get("/elements").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(elements)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get("/elements");
    expect(res.statusCode).toEqual(401);
  })
});

describe("GET /elements/:ele", () => {
  const ele = "fire";
  const element = {
    element: 'fire',
    img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-fire-damage.png',
    weapons: [{
      id: 1,
      name: "w1",
      type: "great-sword",
      attack: 1,
      affinity: 1,
      rarity: 1
    }],
    monsters: [{
      id: 1,
      name: "m1"
    }]
  };

  test("ok for users", async () => {
    const res = await request(app).get(`/elements/${ele}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual(element)
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/elements/${ele}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual(element)
  });

  test("not found for no element", async function () {
    const res = await request(app).get(`/elements/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/elements/${ele}`);
    expect(res.statusCode).toEqual(401);
  })
});