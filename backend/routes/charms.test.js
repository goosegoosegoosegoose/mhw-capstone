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

describe("GET /charms", () => {
  const charms = [
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
    }
  ];

  test("ok for user", async () => {
    const res = await request(app).get("/charms").set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(charms)
  });

  test("ok for admin", async () => {
    const res = await request(app).get("/charms").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(charms)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get("/charms");
    expect(res.statusCode).toEqual(401);
  })
});

describe("GET /charms/:id", () => {
  const id = 1;
  const charm = {
    id: 1,
    name: "c1",
    level: 1,
    rarity: 1,
    skills: [{
      id: 1, 
      name: "s1",
      level: 1,
      description: "tests1"
    }],
    materials: [{
      id: 1, 
      name: "i1",
      quantity: 1,
      description: "testi1"
    }]
  };

  test("ok for users", async () => {
    const res = await request(app).get(`/charms/${id}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual(charm)
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/charms/${id}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual(charm)
  });

  test("not found for no charm id", async function () {
    const res = await request(app).get(`/charms/9999`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/charms/${id}`);
    expect(res.statusCode).toEqual(401);
  })
});

describe("POST /charms/:id/user/:username", () => {
  const newUserCharm = {
    username: "u1",
    charm_id: 2
  };

  test("ok for correct user", async () => {
    const res = await request(app).post(`/charms/${newUserCharm.charm_id}/user/${newUserCharm.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(201);
  });

  test("ok for admin", async () => {
    const res = await request(app).post(`/charms/${newUserCharm.charm_id}/user/${newUserCharm.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).post(`/charms/${newUserCharm.charm_id}/user/${newUserCharm.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid charm id", async () => {
    const res = await request(app).post(`/charms/no/user/${newUserCharm.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/charms/${newUserCharm.charm_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("DELETE /charms/:id/user/:username", () => {
  const userCharm = {
    username: "u1",
    charm_id: 1
  };

  test("ok for correct user", async () => {
    const res = await request(app).delete(`/charms/${userCharm.charm_id}/user/${userCharm.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
  });

  test("ok for admin", async () => {
    const res = await request(app).delete(`/charms/${userCharm.charm_id}/user/${userCharm.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).delete(`/charms/${userCharm.charm_id}/user/${userCharm.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid charm id", async () => {
    const res = await request(app).delete(`/charms/no/user/${userCharm.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/charms/${userCharm.charm_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});