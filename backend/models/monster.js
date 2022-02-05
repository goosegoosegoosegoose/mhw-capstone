"use strict"

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

class Monster {
  static async create(id, name, type, species, description){
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monsters
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;
 
    await db.query(
      `INSERT INTO monsters
       (id, name, type, species, description)
       VALUES ($1, $2, $3, $4, $5)`,
    [id, name, type, species, description]);
  }

  static async createLocation(monId, locId) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_locations
       WHERE monster_id = $1 AND location_id = $2`,
    [monId, locId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_locations
       (monster_id, location_id)
       VALUES ($1, $2)`,
    [monId, locId])
  }

  static async createWeakness(monId, ele, stars, cond) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_weaknesses
       WHERE monster_id = $1 AND element = $2`,
    [monId, ele]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_weaknesses
       (monster_id, element, stars, condition)
       VALUES ($1, $2, $3, $4)`,
    [monId, ele, stars, cond])
  }

  static async createResistance(monId, ele, cond) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_resistances
       WHERE monster_id = $1 AND element = $2`,
    [monId, ele]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_resistances
       (monster_id, element, condition)
       VALUES ($1, $2, $3)`,
    [monId, ele, cond])
  }

  static async createAilment(monId, ailId) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_ailments
       WHERE monster_id = $1 AND ailment_id = $2`,
    [monId, ailId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_ailments
       (monster_id, ailment_id)
       VALUES ($1, $2)`,
    [monId, ailId])
  }

  static async createReward(id, monId, itemId, conditions) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_rewards
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_rewards
       (id, monster_id, item_id, conditions)
       VALUES ($1, $2, $3, $4)`,
    [id, monId, itemId, conditions])
  }

  static async add(username, monId) {
    const preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user ${username}`);

    const duplicateCheck = await db.query(
      `SELECT monId
       FROM user_monsters
       WHERE monster_id = $1`,
    [monId]);
    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate monster`);

    const res = await db.query(`
      INSERT INTO monsters
      (username, monster_id)
      VALUES ($1, $2)
      RETURNING username, monster_id AS "monId"`,
    [id]);
    
    return res.rows[0];
  }

  static async findAll(){
    let res = await db.query(
      `SELECT id, name, type, species, description 
       FROM monsters`);
    
    return res.rows;    
  }

  static async remove(monId) {
    const res = await db.query(
      `DELETE
       FROM user_monsters
       WHERE id = $1
       returning id`,
    [monId]);
    if (!res.rows[0]) throw new NotFoundError(`No monster with id`);
  }
}

module.exports = Monster; 