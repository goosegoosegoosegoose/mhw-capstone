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

describe("GET /weapons", () => {
  const weaponTypes = [
    {
      type: "great-sword",
      img: "http://t1.img"
    },
    {
      type: "bow",
      img: "http://t2.img"
    },
    {
      type: "switch-axe",
      img: "http://t3.img"
    },
    {
      type: "gunlance",
      img: "http://t4.img"
    },
    {
      type: "insect-glaive",
      img: "http://t5.img"
    },
    {
      type: "light-bowgun",
      img: "http://t6.img"
    }
  ];
  const oneType = [{
    type: "great-sword",
    img: "http://t1.img"
  }]

  test("ok for user", async () => {
    const res = await request(app).get("/weapons").set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(weaponTypes)
  });

  test("ok for admin", async () => {
    const res = await request(app).get("/weapons").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(weaponTypes)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get("/weapons");
    expect(res.statusCode).toEqual(401);
  });

  test("filter type", async () => {
    const res = await request(app).get("/weapons").query({type: "great-sword"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneType)
  })
});

describe("GET /weapons/:type", () => {
  const type = "great-sword";
  const list = [
    {
      id: 1,
      name: "w1",
      img: "http://w1.img"
    },
    {
      id: 7,
      name: "w7",
      img: "http://w7.img"
    }
  ];
  const oneWeapon = [{
    id: 1,
    name: "w1",
    img: "http://w1.img"
  }];

  test("ok for user", async () => {
    const res = await request(app).get(`/weapons/${type}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual(list)
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/weapons/${type}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual(list)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/weapons/${type}`);
    expect(res.statusCode).toEqual(401);
  });

  test("filter name", async () => {
    const res = await request(app).get(`/weapons/${type}`).query({name: "w1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneWeapon)
  });

  test("filter elderseal", async () => {
    const res = await request(app).get(`/weapons/${type}`).query({elderseal: "testseal1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneWeapon)
  });

  test("filter rarity", async () => {
    const res = await request(app).get(`/weapons/${type}`).query({rarity: 1}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneWeapon)
  });

  test("filter bow coatings", async () => {
    const res = await request(app).get(`/weapons/bow`).query({coatings: "test1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{
      id: 2,
      name: "w2",
      img: "http://w2.img"
    }])
  });

  test("filter switch-axe/charge-blade phial type", async () => {
    const res = await request(app).get(`/weapons/switch-axe`).query({phial_type: "testphial1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{
      id: 3,
      name: "w3",
      img: "http://w3.img"
    }])
  });
  
  test("filter gunlance shelling type", async () => {
    const res = await request(app).get(`/weapons/gunlance`).query({shelling_type: "testshell1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{
      id: 4,
      name: "w4",
      img: "http://w4.img"
    }])
  });

  test("filter insect-glaive boost type", async () => {
    const res = await request(app).get(`/weapons/insect-glaive`).query({boost_type: "testboost1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{
      id: 5,
      name: "w5",
      img: "http://w5.img"
    }])
  });
  
  test("filter light-bowgun/heavy-bowgun ammo type", async () => {
    const res = await request(app).get(`/weapons/light-bowgun`).query({ammo_type: "testammo1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{
      id: 6,
      name: "w6",
      img: "http://w6.img"
    }])
  });

  test("filter insect-glaive boost type", async () => {
    const res = await request(app).get(`/weapons/light-bowgun`).query({special_ammo: "testspecialammo1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{
      id: 6,
      name: "w6",
      img: "http://w6.img"
    }])
  });

  test("filter light-bowgun/heavy-bowgun deviation", async () => {
    const res = await request(app).get(`/weapons/light-bowgun`).query({deviation: "testdeviation1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{
      id: 6,
      name: "w6",
      img: "http://w6.img"
    }])
  });
});

describe("GET /weapons/w/:id", () => {
  const id = 1;
  const weapon = {
    id: 1,
    name: 'w1',
    type: 'great-sword',
    attack: 1,
    affinity: 1,
    defense: 1,
    damage_type: 'testdmg1',
    slots: {1:1},
    rarity: 1,
    elderseal: 'testseal1',
    img: 'http://w1.img',
    white_sharpness: [1],
    elements: [{
      element: "fire",
      damage: 1,
      hidden: true
    }],
    materials: [{
      id: 1,
      material: "i1",
      quantity: 1,
      description: "testi1"
    }]
  };

  test("ok for user", async () => {
    const res = await request(app).get(`/weapons/w/${id}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      ...weapon
    })
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/weapons/w/${id}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      ...weapon
    })
  });

  test("not found for no weapon id", async function () {
    const res = await request(app).get(`/weapons/w/9999`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/weapons/w/${id}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bow (coatings)", async () => {
    const res = await request(app).get("/weapons/w/2").set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      id: 2,
      name: 'w2',
      type: 'bow',
      attack: 2,
      affinity: 2,
      defense:2,
      damage_type: 'testdmg2',
      slots: {1:1},
      rarity: 2,
      elderseal: 'testseal2',
      img: 'http://w2.img',
      coatings: ["test1"],
      elements:[{
        element: "water",
        damage: 2,
        hidden: false
      }],
      materials: [{
        id: 2,
        material: "i2",
        quantity: 2,
        description: "testi2"
      }]
    })
  });

  test("switch-axe/charge-blade (phials + sharpness)", async () => {
    const res = await request(app).get("/weapons/w/3").set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      id: 3,
      name: 'w3',
      type: 'switch-axe',
      attack: 3,
      affinity: 3,
      defense:3,
      damage_type: 'testdmg3',
      slots: {1:1},
      rarity: 3,
      elderseal: 'testseal3',
      img: 'http://w3.img',
      white_sharpness: [1],
      phial_type: "testphial1",
      phial_damage: 1,
      elements:[],
      materials: []
    })
  });

  test("gunlance (shells + sharpness)", async () => {
    const res = await request(app).get("/weapons/w/4").set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      id: 4,
      name: 'w4',
      type: 'gunlance',
      attack: 4,
      affinity: 4,
      defense:4,
      damage_type: 'testdmg4',
      slots: {1:1},
      rarity: 4,
      elderseal: 'testseal4',
      img: 'http://w4.img',
      white_sharpness: [1],
      shelling_type: "testshell1",
      shelling_level: 1,
      elements:[],
      materials: []
    })
  });

  test("insect glaive (boost and sharpness)", async () => {
    const res = await request(app).get("/weapons/w/5").set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      id: 5,
      name: 'w5',
      type: 'insect-glaive',
      attack: 5,
      affinity: 5,
      defense:5,
      damage_type: 'testdmg5',
      slots: {1:1},
      rarity: 5,
      elderseal: 'testseal5',
      img: 'http://w5.img',
      white_sharpness: [1],
      boost_type: "testboost1",
      elements:[],
      materials: []
    })
  });

  test("light bowgun/heavy bowgun (ammo types, special ammo, deviation)", async () => {
    const res = await request(app).get("/weapons/w/6").set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      id: 6,
      name: 'w6',
      type: 'light-bowgun',
      attack: 6,
      affinity: 6,
      defense:6,
      damage_type: 'testdmg6',
      slots: {1:1},
      rarity: 6,
      elderseal: 'testseal6',
      img: 'http://w6.img',
      special_ammo: "testspecialammo1",
      deviation: "testdeviation1",
      ammo: [{
        ammo_type: "testammo1",
        ammo_capacity: [1]
      }],
      elements:[],
      materials: []
    })
  });
});

describe("POST /weapons/:id/user/:username", () => {
  const newUserWeapon = {
    username: "u1",
    weapon_id: 2
  };

  test("ok for correct user", async () => {
    const res = await request(app).post(`/weapons/${newUserWeapon.weapon_id}/user/${newUserWeapon.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(201);
  });

  test("ok for admin", async () => {
    const res = await request(app).post(`/weapons/${newUserWeapon.weapon_id}/user/${newUserWeapon.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).post(`/weapons/${newUserWeapon.weapon_id}/user/${newUserWeapon.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid weapon id", async () => {
    const res = await request(app).post(`/weapons/no/user/${newUserWeapon.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/weapons/${newUserWeapon.weapon_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  })
});

describe("DELETE /weapons/:id/user/:username", () => {
  const userWeapon = {
    username: "u1",
    weapon_id: 1
  };

  test("ok for correct user", async () => {
    const res = await request(app).delete(`/weapons/${userWeapon.weapon_id}/user/${userWeapon.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
  });

  test("ok for admin", async () => {
    const res = await request(app).delete(`/weapons/${userWeapon.weapon_id}/user/${userWeapon.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).delete(`/weapons/${userWeapon.weapon_id}/user/${userWeapon.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid weapon id", async () => {
    const res = await request(app).delete(`/weapons/no/user/${userWeapon.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/weapons/${userWeapon.weapon_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  })
})