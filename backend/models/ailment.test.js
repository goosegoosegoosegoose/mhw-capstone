"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Ailment = require("./ailment")
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const { test, expect } = require("@jest/globals");
const { fail } = require("yargs");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", () => {
  let newAilment = {
    id: 3,
    name: "a3",
    description: "test"
  };

  test("works", async () => {
    await Ailment.create(newAilment.id, newAilment.name, newAilment.description);
    let res = await db.query(`SELECT * FROM ailments WHERE id = $1`, [newAilment.id]);
    let ailment = res.rows[0];
    expect(ailment).toEqual({
      ...newAilment
    });
  });

  test("duplicate ailment", async () => {
    try {
      await Ailment.create(newAilment.id, newAilment.name, newAilment.description);
      await Ailment.create(newAilment.id, newAilment.name, newAilment.description);
      fail();
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});
