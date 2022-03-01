"use strict";

const db = require("../db.js");
const Item = require("./item")
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
  const newItem = {
    id: 3,
    name: "test",
    description: "test",
    rarity: 3
  };

  test("works", async () => {
    await Item.create(newItem.id, newItem.name, newItem.description, newItem.rarity);
    const res = await db.query(`SELECT * FROM items WHERE id = $1`, [newItem.id]);
    const item = res.rows[0];
    expect(item).toEqual({
      ...newItem
    })
  })
})