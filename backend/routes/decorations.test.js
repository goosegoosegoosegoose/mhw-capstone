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

describe("GET /decorations", () => {
  const decorations = [
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
  ];

  test("ok for user", async () => {
    const res = await request(app).get("/decorations").set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(decorations)
  });

  test("ok for admin", async () => {
    const res = await request(app).get("/decorations").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(decorations)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get("/decorations");
    expect(res.statusCode).toEqual(401);
  })
});

describe("GET /decorations/:id", () => {
  const id = 1;
  const decoration = {
    id: 1,
    name: "d1",
    rarity: 1,
    slot: 1,
    skills: [{
      id: 1,
      name: "s1",
      level: 1,
      description: "tests1"
    }]
  };

  test("ok for users", async () => {
    const res = await request(app).get(`/decorations/${id}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual(decoration)
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/decorations/${id}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual(decoration)
  });

  test("not found for no decoration id", async function () {
    const res = await request(app).get(`/decorations/9999`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/decorations/${id}`);
    expect(res.statusCode).toEqual(401);
  })
});

describe("POST /decorations/:id/user/:username", () => {
  const newUserDecoration = {
    username: "u1",
    decoration_id: 2
  };

  test("ok for correct user", async () => {
    const res = await request(app).post(`/decorations/${newUserDecoration.decoration_id}/user/${newUserDecoration.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(201);
  });

  test("ok for admin", async () => {
    const res = await request(app).post(`/decorations/${newUserDecoration.decoration_id}/user/${newUserDecoration.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).post(`/decorations/${newUserDecoration.decoration_id}/user/${newUserDecoration.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid decoration id", async () => {
    const res = await request(app).post(`/decorations/no/user/${newUserDecoration.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/decorations/${newUserDecoration.decoration_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("DELETE /decorations/:id/user/:username", () => {
  const userDecoration = {
    username: "u1",
    decoration_id: 1
  };

  test("ok for correct user", async () => {
    const res = await request(app).delete(`/decorations/${userDecoration.decoration_id}/user/${userDecoration.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
  });

  test("ok for admin", async () => {
    const res = await request(app).delete(`/decorations/${userDecoration.decoration_id}/user/${userDecoration.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).delete(`/decorations/${userDecoration.decoration_id}/user/${userDecoration.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid decoration id", async () => {
    const res = await request(app).delete(`/decorations/no/user/${userDecoration.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/decorations/${userDecoration.decoration_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});