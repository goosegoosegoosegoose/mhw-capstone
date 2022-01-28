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