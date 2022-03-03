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

describe("GET /locations", () => {
  const locations = [
    {
      id: 1,
      name: "L1",
      zone_count: 1,
      camps: {name:"camp1"},
      icon: "http://L1.icon",
      imgs: ["http://L1.img"]
    },
    {
      id: 2,
      name: "L2",
      zone_count: 2,
      camps: {name:"camp2"},
      icon: "http://L2.icon",
      imgs: ["http://L2.img"]
    },
    {
      id: 3,
      name: "L3",
      zone_count: 3,
      camps: {name:"camp3"},
      icon: "http://L3.icon",
      imgs: ["http://L3.img"]
    }
  ];

  test("ok for user", async () => {
    const res = await request(app).get("/locations").set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(locations)
  });

  test("ok for admin", async () => {
    const res = await request(app).get("/locations").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(locations)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get("/locations");
    expect(res.statusCode).toEqual(401);
  })
});

describe("GET /locations/:id", () => {
  const id = 1;
  const location = {
    id: 1,
    name: "L1",
    zone_count: 1,
    camps: {name:"camp1"},
    icon: "http://L1.icon",
    imgs: ["http://L1.img"],
    monsters: [{
      id: 1,
      name: "m1",
      icon: "http://m1.icon"
    }]
  };

  test("ok for users", async () => {
    const res = await request(app).get(`/locations/${id}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual(location)
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/locations/${id}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual(location)
  });

  test("not found for no location id", async function () {
    const res = await request(app).get(`/locations/9999`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/locations/${id}`);
    expect(res.statusCode).toEqual(401);
  })
});