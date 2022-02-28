"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const ArmorSet = require("./armorset");
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
  let newArmorSet = {
    id: 3, 
    name: "as3", 
    rank: "test",
    set_bonus: 'testbonusas3'
  };

  test("works", async () => {
    await ArmorSet.create(newArmorSet.id, newArmorSet.name, newArmorSet.rank, newArmorSet.set_bonus);
    let res = await db.query(`SELECT * FROM armor_sets WHERE id = $1`, [newArmorSet.id]);
    let armorSet = res.rows[0];
    expect(armorSet).toEqual({
      ...newArmorSet
    });
  });

  test("duplicate armor", async () => {
    try {
      await ArmorSet.create(newArmorSet.id, newArmorSet.name, newArmorSet.rank, newArmorSet.set_bonus);
      await ArmorSet.create(newArmorSet.id, newArmorSet.name, newArmorSet.rank, newArmorSet.set_bonus);
      fail();
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("createSkill", () => {
  let newSetSkill = {
    armor_set_id: 3,
    skill_id: 2,
    pieces: 4
  };

  test("works", async () => {
    await ArmorSet.createSkill(newSetSkill.armor_set_id, newSetSkill.skill_id, newSetSkill.pieces);
    let res = await db.query(`SELECT * FROM set_skills WHERE armor_set_id = $1 AND skill_id = $2`, [newSetSkill.armor_set_id, newSetSkill.skill_id]);
    let setSkill = res.rows[0];
    expect(setSkill).toEqual({
      ...newSetSkill,
      id: expect.any(Number)
    });
  });

  test("duplicate armor skill", async () => {
    try {
      await ArmorSet.createSkill(newSetSkill.armor_set_id, newSetSkill.skill_id, newSetSkill.pieces);
      await ArmorSet.createSkill(newSetSkill.armor_set_id, newSetSkill.skill_id, newSetSkill.pieces);
      fail();
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("findAll", () => {
  test("works", async () => {
    const armorSets = await ArmorSet.findAll();
    expect(armorSets).toEqual([
      {
        id: 1,
        name: "as1",
        rank: "testrank1",
        set_bonus: "testbonusas1",
        defense_base: 5,
        defense_max: 5,
        defense_augmented: 5
      },
      {
        id: 2,
        name: "as2",
        rank: "testrank2",
        set_bonus: "testbonusas2",
        defense_base: 0,
        defense_max: 0,
        defense_augmented: 0
      }
    ])
  });
});

// describe("findArmor", () => {
//   test("works", async () => {
//     const id = 1;
//     let armor = await Armor.findArmor(id);
//     expect(armor).toEqual({
//       id: 1, 
//       name: "a1",
//       type: "head", 
//       rank: "testranka1",
//       slots: {1:1, 2:1, 3:1, 4:1},
//       rarity: 1, 
//       defense_base: 1, 
//       defense_max: 1, 
//       defense_augmented: 1, 
//       armor_set_id: 1,
//       m_img: "testa1m", 
//       f_img: "testa1f"
//     })
//   });

//   test("not found", async () => {
//     try {
//       await Armor.findArmor(9999999);
//       fail();
//     } catch (e) {
//       expect(e instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });

// describe("findArmorSet", () => {
//   test("works", async () => {
//     const id = 1;
//     let armorSet = await Armor.findArmorSet(id);
//     expect(armorSet).toEqual({
//       id: 1, 
//       name: "as1"
//     })
//   });

//   test("not found", async () => {
//     try {
//       await Armor.findArmorSet(9999999);
//       fail();
//     } catch (e) {
//       expect(e instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });

// describe("findArmorSkills", () => {
//   test("works", async () => {
//     const id = 1;
//     let armorSkills = await Armor.findSkills(id);
//     expect(armorSkills).toEqual([{
//       id: 1, 
//       name: "s1"
//     }])
//   });

//   test("not found", async () => {
//     const armorSkills = await Armor.findSkills(9999999);
//     expect(armorSkills).toEqual([]);
//   });
// });

// describe("findArmorMaterials", () => {
//   test("works", async () => {
//     const id = 1;
//     let armorMaterials = await Armor.findMaterials(id);
//     expect(armorMaterials).toEqual([{
//       id: 1, 
//       material: "i1",
//       quantity: 1,
//       description: "testi1"
//     }])
//   });

//   test("not found", async () => {
//     const armorMaterials = await Armor.findMaterials(9999999);
//     expect(armorMaterials).toEqual([]);
//   });
// });

// describe("userAdd", () => {
//   let username = "u1"
//   let armor_id = 5;

//   test("works", async () => {
//     await Armor.userAdd(username, armor_id);
//     let res = await db.query(`SELECT * FROM user_armor WHERE username = $1 AND armor_id = $2`, [username, armor_id]);
//     let armor = res.rows;
//     expect(armor).toEqual([
//       {
//         id: expect.any(Number),
//         username: username,
//         armor_id: armor_id,
//         slots: {1:1, 2:1, 3:1, 4:1}
//       }
//     ])
//   });

//   test("user not found", async () => {
//     try {
//       await Armor.userAdd("nope", armor_id);
//       fail()
//     } catch (e) {
//       expect(e instanceof NotFoundError).toBeTruthy()
//     }
//   });

//   test("duplicate user armor", async () => {
//     try {
//       await Armor.userAdd(username, 1);
//       fail()
//     } catch (e) {
//       expect(e instanceof BadRequestError).toBeTruthy()
//     }
//   })
// })

// describe("userRemove", () => {
//   let username = "u1"
//   let armor_id = 1;

//   test("works", async () => {
//     await Armor.userRemove(username, armor_id);
//     let res = await db.query(`SELECT * FROM user_armor WHERE username = $1 AND armor_id = $2`, [username, armor_id]);
//     expect(res.rows.length).toEqual(0);
//   });

//   test("user not found", async () => {
//     try {
//       await Armor.userRemove("nope", armor_id);
//       fail()
//     } catch (e) {
//       expect(e instanceof NotFoundError).toBeTruthy()
//     }
//   });
// })