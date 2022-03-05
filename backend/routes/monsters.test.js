"use strict";

const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken
} = require("./_testCommon");
const { test, expect } = require("@jest/globals");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /monsters", () => {
  const monsters = [
    {
      id: 1,
      name: "m1",
      type: "testtypem1",
      species: "testspeciesm1",
      description: "testm1",
      icon: "http://m1.icon",
      img: "http://m1.img"
    },
    {
      id: 2,
      name: "m2",
      type: "testtypem2",
      species: "testspeciesm2",
      description: "testm2",
      icon: "http://m2.icon",
      img: "http://m2.img"
    }
  ];
  const oneMonster = [{
    id: 1,
    name: "m1",
    type: "testtypem1",
    species: "testspeciesm1",
    description: "testm1",
    icon: "http://m1.icon",
    img: "http://m1.img"
  }];

  test("ok for user", async () => {
    const res = await request(app).get("/monsters").set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(monsters)
  });

  test("ok for admin", async () => {
    const res = await request(app).get("/monsters").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(monsters)
  });

  test("not found for no monster id", async function () {
    const res = await request(app).get(`/monsters/9999`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get("/monsters");
    expect(res.statusCode).toEqual(401);
  });

  test("filter name", async () => {
    const res = await request(app).get("/monsters").query({name: "m1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneMonster)
  });

  test("filter type", async () => {
    const res = await request(app).get("/monsters").query({type: "testtypem1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneMonster)
  });

  test("filter species", async () => {
    const res = await request(app).get("/monsters").query({species: "testspeciesm1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneMonster)
  });

  test("invalid filter key", async () => {
    const res = await request(app).get("/monsters").query({nope: "no"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(500);
  })
});

describe("GET /monsters/:id", () => {
  const id = 1;
  const monster = {
    id: 1,
    name: "m1",
    type: "testtypem1",
    species: "testspeciesm1",
    description: "testm1",
    icon: "http://m1.icon",
    img: "http://m1.img",
    locations: [{
      id: 1,
      location: "L1"
    }],
    weaknesses: [{
      id: "fire",
      element: "fire",
      condition: "testcond1",
      stars: 1
    }],
    ailments: [{
      id: 1,
      ailment: "a1",
      description: "testa1"
    }],
    materials: [{
      id: 1,
      material: "i1",
      type: "testtypec1",
      rank: "testrank1",
      quantity: 1,
      chance: 10,
      subtype: "test"
    }]
  };

  test("ok for users", async () => {
    const res = await request(app).get(`/monsters/${id}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual(monster)
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/monsters/${id}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual(monster)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/monsters/${id}`);
    expect(res.statusCode).toEqual(401);
  })
});

describe("POST /monsters/:id/user/:username", () => {
  const newUserMonster = {
    username: "u1",
    monster_id: 2
  };

  test("ok for correct user", async () => {
    const res = await request(app).post(`/monsters/${newUserMonster.monster_id}/user/${newUserMonster.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(201);
  });

  test("ok for admin", async () => {
    const res = await request(app).post(`/monsters/${newUserMonster.monster_id}/user/${newUserMonster.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).post(`/monsters/${newUserMonster.monster_id}/user/${newUserMonster.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid monster id", async () => {
    const res = await request(app).post(`/monsters/no/user/${newUserMonster.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/monsters/${newUserMonster.monster_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("DELETE /monsters/:id/user/:username", () => {
  const userMonster = {
    username: "u1",
    monster_id: 1
  };

  test("ok for correct user", async () => {
    const res = await request(app).delete(`/monsters/${userMonster.monster_id}/user/${userMonster.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
  });

  test("ok for admin", async () => {
    const res = await request(app).delete(`/monsters/${userMonster.monster_id}/user/${userMonster.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).delete(`/monsters/${userMonster.monster_id}/user/${userMonster.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid monster id", async () => {
    const res = await request(app).delete(`/monsters/no/user/${userMonster.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/monsters/${userMonster.monster_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});