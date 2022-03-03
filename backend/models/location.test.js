"use strict";

const { NotFoundError } = require("../expressError");
const db = require("../db.js");
const Location = require("./location")
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
  const newLocation = {
    id: 4,
    name: "test",
    zone_count: 1,
    camps: {test:"test"},
    icon: null,
    imgs: null
  };

  test("works", async () => {
    await Location.create(newLocation.id, newLocation.name, newLocation.zone_count, newLocation.camps, newLocation.icon, newLocation.imgs)
    const res = await db.query(`SELECT * FROM locations WHERE id = $1`, [newLocation.id]);
    const location = res.rows[0];
    expect(location).toEqual({
      ...newLocation
    })
  })
});

describe("updateAsset", () => {
  const id = 1;
  const newAsset = {
    icon: "test",
    imgs: ["test"]
  };

  test("works", async () => {
    await Location.updateAsset(id, newAsset.icon, newAsset.imgs);
    const res = await db.query(`SELECT * FROM locations WHERE id = $1`, [id]);
    const location = res.rows[0];
    expect(location).toEqual({
      id: 1,
      name: "L1",
      zone_count: 1,
      camps: {name:"camp1"},
      icon: "test",
      imgs: ["test"]
    })
  })
});

describe("findAll", () => {
  test("works", async () => {
    const locations = await Location.findAll();
    expect(locations).toEqual([
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
    ])
  });

  test("filter name", async () => {
    const locations = await Location.findAll({name: "L1"});
    expect(locations).toEqual([{
      id: 1,
      name: "L1",
      zone_count: 1,
      camps: {name:"camp1"},
      icon: "http://L1.icon",
      imgs: ["http://L1.img"]
    }])
  })
});

describe("findLocation", () => {
  const id = 1;
  
  test("works", async () => {
    const location = await Location.findLocation(id);
    expect(location).toEqual({
      id: 1,
      name: "L1",
      zone_count: 1,
      camps: {name:"camp1"},
      icon: "http://L1.icon",
      imgs: ["http://L1.img"]
    })
  });

  test("not found", async () => {
    try {
      await Location.findLocation(999999999);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  })
});

describe("findMonsters", () => {
  const id = 1;

  test("works", async () => {
    const monsters = await Location.findMonsters(id);
    expect(monsters).toEqual([{
      id: 1,
      name: "m1",
      icon: "http://m1.icon"
    }])
  });

  test("not found", async () => {
    const monsters = await Location.findMonsters(9999999);
    expect(monsters).toEqual([])
  })
})