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

describe("GET /armor", () => {
  const armor = [
    {
      id: 1,
      name: "a1",
      m_img: "testa1m",
      f_img: "testa1f"
    },
    {
      id: 2,
      name: "a2",
      m_img: "testa2m",
      f_img: "testa2f"
    },
    {
      id: 3,
      name: "a3",
      m_img: "testa3m",
      f_img: "testa3f"
    },
    {
      id: 4,
      name: "a4",
      m_img: "testa4m",
      f_img: "testa4f"
    },
    {
      id: 5,
      name: "a5",
      m_img: "testa5m",
      f_img: "testa5f"
    },
    {
      id: 7,
      name: "a7",
      m_img: "testa7m",
      f_img: "testa7f"
    }
  ];
  const oneArmor = [{
    id: 1,
    name: "a1",
    m_img: "testa1m",
    f_img: "testa1f"
  }];

  test("ok for user", async () => {
    const res = await request(app).get("/armor").set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(armor)
  });

  test("ok for admin", async () => {
    const res = await request(app).get("/armor").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(armor)
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get("/armor");
    expect(res.statusCode).toEqual(401);
  });

  test("filter name", async () => {
    const res = await request(app).get("/armor").query({name: "a1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneArmor)
  });

  test("filter type", async () => {
    const res = await request(app).get("/armor").query({type: "head"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneArmor)
  });

  test("filter rank", async () => {
    const res = await request(app).get("/armor").query({rank: "testranka1"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneArmor)
  });

  test("filter rarity", async () => {
    const res = await request(app).get("/armor").query({rarity: 1}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(oneArmor)
  });

  test("invalid filter key", async () => {
    const res = await request(app).get("/armor").query({nope: "no"}).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(500);
  })
});

describe("GET /armor/:id", () => {
  const id = 1;
  const body = {
    id: 1, 
    name: "a1",
    type: "head", 
    rank: "testranka1",
    slots: {1:1, 2:1, 3:1, 4:1},
    rarity: 1, 
    defense_base: 1, 
    defense_max: 1, 
    defense_augmented: 1, 
    armor_set_id: 1,
    m_img: "testa1m", 
    f_img: "testa1f",
    set: {
      id: 1,
      name: "as1"
    },
    skills: [{
      id: 1,
      name: "s1"
    }],
    materials: [{
      id: 1,
      material: "i1",
      description: "testi1",
      quantity: 1
    }]
  }

  test("ok for user", async () => {
    const res = await request(app).get(`/armor/${id}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      ...body
    })
  });

  test("ok for admin", async () => {
    const res = await request(app).get(`/armor/${id}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      ...body
    })
  });

  test("not found for no armor id", async function () {
    const res = await request(app).get(`/armor/9999`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("unauth for nonuser/nonadmin", async () => {
    const res = await request(app).get(`/armor/${id}`);
    expect(res.statusCode).toEqual(401);
  });
});

describe("POST /armor/:id/user/:username", () => {
  const newUserArmor = {
    username: "u1",
    armor_id: 5
  };

  test("ok for correct user", async () => {
    const res = await request(app).post(`/armor/${newUserArmor.armor_id}/user/${newUserArmor.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(201);
  });

  test("ok for admin", async () => {
    const res = await request(app).post(`/armor/${newUserArmor.armor_id}/user/${newUserArmor.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
  
  });
  
  test("unauth for incorrect user", async () => {
    const res = await request(app).post(`/armor/${newUserArmor.armor_id}/user/${newUserArmor.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid armor id", async () => {
    const res = await request(app).post(`/armor/no/user/${newUserArmor.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/armor/${newUserArmor.armor_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("DELETE /armor/:id/user/:username", () => {
  const userArmor = {
    username: "u1",
    armor_id: 1
  };

  test("ok for correct user", async () => {
    const res = await request(app).delete(`/armor/${userArmor.armor_id}/user/${userArmor.username}`).set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
  });

  test("ok for admin", async () => {
    const res = await request(app).delete(`/armor/${userArmor.armor_id}/user/${userArmor.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  test("unauth for incorrect user", async () => {
    const res = await request(app).delete(`/armor/${userArmor.armor_id}/user/${userArmor.username}`).set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("bad request with invalid armor id", async () => {
    const res = await request(app).delete(`/armor/no/user/${userArmor.username}`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  });

  test("bad request with invalid username", async () => {
    const res = await request(app).post(`/armor/${userArmor.armor_id}/user/nope`).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
})