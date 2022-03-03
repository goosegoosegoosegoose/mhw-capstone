"use strict";

const { NotFoundError } = require("../expressError");
const Element = require("./element")
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

describe("findAll", () => {
  test("works", async () => {
    const elements = await Element.findAll();
    expect(elements).toEqual([
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
    ])
  });

  test("filter element", async () => {
    const name = "fire";
    const element = await Element.findAll({element: name});
    expect(element).toEqual([{
      element: "fire",
      img: "https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-fire-damage.png"
    }])
  })
});

describe("findElement", () => {
  const e = "fire";

  test("works", async () => {
    const element = await Element.findElement(e);
    expect(element).toEqual({
      element: 'fire',
      img: 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-fire-damage.png'
    })
  });

  test("not found", async () => {
    try {
      await Element.findElement("nope");
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  })
})

describe("findWeapons", () => {
  const element = "fire";

  test("works", async () => {
    let weapons = await Element.findWeapons(element);
    expect(weapons).toEqual([{
      id: 1,
      name: "w1",
      type: "great-sword",
      attack: 1,
      affinity: 1,
      rarity: 1
    }])
  })

  test("not found", async () => {
    let weapons = await Element.findWeapons("nope");
    expect(weapons).toEqual([])
  })
});

describe("findMonsters", () => {
  const element = "fire";

  test("works", async () => {
    let monsters = await Element.findMonsters(element);
    expect(monsters).toEqual([{
      id: 1,
      name: "m1"
    }])
  })

  test("not found", async () => {
    let monsters = await Element.findMonsters("nope");
    expect(monsters).toEqual([])
  })
});

