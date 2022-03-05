"use strict";

const { BadRequestError, NotFoundError } = require("../expressError");
const db = require("../db.js");
const Monster = require("./monster")
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

describe("create", () =>{
  const newMonster = {
    id: 3,
    name: "testname",
    type: "testtype",
    species: "testspecies",
    description: "testdesc",
    icon: null,
    img: null
  };

  test("work", async () => {
    await Monster.create(newMonster.id, newMonster.name, newMonster.type, newMonster.species, newMonster.description);
    const res = await db.query(`SELECT * FROM monsters WHERE id = $1`, [newMonster.id]);
    const monster = res.rows[0];
    expect(monster).toEqual({
      ...newMonster
    })
  })
});

describe("updateAsset", () => {
  const id = 1;
  const newAsset = {
    icon: "testicon",
    img: "testimg"
  };

  test("works", async () => {
    await Monster.updateAsset(id, newAsset.icon, newAsset.img);
    const res = await db.query(`SELECT * FROM monsters WHERE id = $1`, [id]);
    const monster = res.rows[0];
    expect(monster).toEqual({
      id: 1,
      name: "m1", 
      type: "testtypem1",
      species: "testspeciesm1",
      description: "testm1",
      icon: "testicon",
      img: "testimg"
    })
  })
});

describe("createLocation", () => {
  const newLocation = {
    monster_id: 1, 
    location_id: 2
  };

  test("works", async () => {
    await Monster.createLocation(newLocation.monster_id, newLocation.location_id);
    const res = await db.query(`SELECT * FROM monster_locations WHERE monster_id = $1 AND location_id = $2`, [newLocation.monster_id, newLocation.location_id]);
    const location = res.rows[0];
    expect(location).toEqual({
      ...newLocation,
      id: expect.any(Number)
    })
  })
});

describe("createWeakness", () => {
  const newWeakness = {
    monster_id: 1, 
    element: "water",
    stars: 1,
    condition: "test"
  };

  test("works", async () => {
    await Monster.createWeakness(newWeakness.monster_id, newWeakness.element, newWeakness.stars, newWeakness.condition);
    const res = await db.query(`SELECT * FROM monster_weaknesses WHERE monster_id = $1 AND element = $2`, [newWeakness.monster_id, newWeakness.element]);
    const weakness = res.rows[0];
    expect(weakness).toEqual({
      ...newWeakness,
      id: expect.any(Number)
    })
  })
});

describe("createAilment", () => {
  const newAilment = {
    monster_id: 1, 
    ailment_id: 2
  };

  test("works", async () => {
    await Monster.createAilment(newAilment.monster_id, newAilment.ailment_id);
    const res = await db.query(`SELECT * FROM monster_ailments WHERE monster_id = $1 AND ailment_id = $2`, [newAilment.monster_id, newAilment.ailment_id]);
    const ailment = res.rows[0];
    expect(ailment).toEqual({
      ...newAilment,
      id: expect.any(Number)
    })
  })
});

describe("createMaterial", () => {
  const newMaterial = {
    id: 3,
    monster_id: 1, 
    item_id: 2
  };

  test("works", async () => {
    await Monster.createMaterial(newMaterial.id, newMaterial.monster_id, newMaterial.item_id);
    const res = await db.query(`SELECT * FROM monster_materials WHERE monster_id = $1 AND item_id = $2`, [newMaterial.monster_id, newMaterial.item_id]);
    const material = res.rows[0];
    expect(material).toEqual({
      ...newMaterial
    })
  })
});

describe("createConditions", () => {
  const newCondition = {
    monster_material_id: 1,
    type: "test",
    rank: "testrank",
    quantity: 1,
    chance: 10,
    subtype: "testsub"
  };

  test("works", async () => {
    await Monster.createConditions(newCondition.monster_material_id, newCondition.type, newCondition.rank, newCondition.quantity, newCondition.chance, newCondition.subtype);
    const res = await db.query(`SELECT * FROM monster_material_conditions WHERE monster_material_id = $1 AND type = $2`, [newCondition.monster_material_id, newCondition.type]);
    const condition = res.rows[0];
    expect(condition).toEqual({
      ...newCondition,
      id: expect.any(Number)
    })
  })
});

describe("findAll", () => {
  test("works", async () => {
    const monsters = await Monster.findAll();
    expect(monsters).toEqual([
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
    ])
  });

  test("filter name", async () => {
    const monsters = await Monster.findAll({name: "m1"});
    expect(monsters).toEqual([{
      id: 1,
      name: "m1",
      type: "testtypem1",
      species: "testspeciesm1",
      description: "testm1",
      icon: "http://m1.icon",
      img: "http://m1.img"
    }])
  })

  test("filter type", async () => {
    const monsters = await Monster.findAll({type: "testtypem2"});
    expect(monsters).toEqual([{
      id: 2,
      name: "m2",
      type: "testtypem2",
      species: "testspeciesm2",
      description: "testm2",
      icon: "http://m2.icon",
      img: "http://m2.img"
    }])
  })

  test("filter species", async () => {
    const monsters = await Monster.findAll({species: "testspeciesm1"});
    expect(monsters).toEqual([{
      id: 1,
      name: "m1",
      type: "testtypem1",
      species: "testspeciesm1",
      description: "testm1",
      icon: "http://m1.icon",
      img: "http://m1.img"
    }])
  })
});

describe("findMonster", () => {
  const id = 1;

  test("works", async () => {
    const monster = await Monster.findMonster(id);
    expect(monster).toEqual({
      id: 1,
      name: "m1",
      type: "testtypem1",
      species: "testspeciesm1",
      description: "testm1",
      icon: "http://m1.icon",
      img: "http://m1.img"
    })
  });

  test("not found", async () => {
    try {
      await Monster.findMonster(9999999);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  })
});

describe("findLocations", () => {
  const id = 1;

  test("works", async () => {
    const locations = await Monster.findLocations(id);
    expect(locations).toEqual([{
      id: 1,
      location: "L1"
    }])
  });

  test("not found", async () => {
    const locations = await Monster.findLocations(99999999);
    expect(locations).toEqual([])
  })
});

describe("findWeaknesses", () => {
  const id = 1;

  test("works", async () => {
    const weaknesses = await Monster.findWeaknesses(id);
    expect(weaknesses).toEqual([{
      id: "fire",
      element: "fire",
      condition: "testcond1",
      stars: 1
    }])
  });

  test("not found", async () => {
    const weaknesses = await Monster.findWeaknesses(99999999);
    expect(weaknesses).toEqual([])
  })
});

describe("findAilments", () => {
  const id = 1;

  test("works", async () => {
    const ailments = await Monster.findAilments(id);
    expect(ailments).toEqual([{
      id: 1,
      ailment: "a1",
      description: "testa1"
    }])
  });

  test("not found", async () => {
    const ailments = await Monster.findAilments(99999999);
    expect(ailments).toEqual([])
  })
});

describe("findMaterials", () => {
  const id = 1;

  test("works", async () => {
    const materials = await Monster.findMaterials(id);
    expect(materials).toEqual([{
      id: 1,
      material: "i1",
      type: "testtypec1",
      rank: "testrank1",
      quantity: 1,
      chance: 10,
      subtype: "test"
    }])
  });

  test("not found", async () => {
    const materials = await Monster.findMaterials(99999999);
    expect(materials).toEqual([])
  })
});

describe("userAdd", () => {
  const username = "u1";
  const monster_id = 2;

  test("works", async () => {
    await Monster.userAdd(username, monster_id);
    const res = await db.query(`SELECT * FROM user_monsters WHERE username = $1 AND monster_id = $2`, [username, monster_id]);
    const monsters = res.rows;
    expect(monsters).toEqual([{
      id: expect.any(Number),
      username: username,
      monster_id: monster_id
    }])
  });

  test("user not found", async () => {
    try {
      await Monster.userAdd("nope", monster_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });

  test("monster not found", async () => {
    try {
      await Monster.userAdd(username, 999999);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });

  test("duplicate user monster", async () => {
    try {
      await Monster.userAdd(username, 1);
      fail()
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy()
    }
  })
});

describe("userRemove", () => {
  const username = "u1"
  const monster_id = 1;

  test("works", async () => {
    await Monster.userRemove(username, monster_id);
    const res = await db.query(`SELECT * FROM user_monsters WHERE username = $1 AND monster_id = $2`, [username, monster_id]);
    expect(res.rows.length).toEqual(0);
  });

  test("user not found", async () => {
    try {
      await Monster.userRemove("nope", monster_id);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });

  test("monster not found", async () => {
    try {
      await Monster.userRemove(username, 999999);
      fail()
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  });
})