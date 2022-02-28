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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function () {
  let newAilment = {
    id: 1,
    name: "a1",
    description: "test"
  };

  test("works", async function () {
    let ailment = await Ailment.create(newAilment);
    expect(ailment).toEqual({
      ...newAilment,
      // id: expect.any(Number),
    });
  });
});
