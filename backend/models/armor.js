"use strict"

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

class Armor {

  static async add(username, armorId) {
    const preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = preCheck.rows[0];

    if (!user) throw new NotFoundError(`No user ${username}`);

    const duplicateCheck = await db.query(
      `SELECT id
       FROM armors
       WHERE username = $1 AND armor_id = $2`,
    [
      username, 
      armorId
    ]);

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate armor`);

    await db.query(
      `INSERT INTO armors
       (username, armor_id)
       VALUES ($1, $2)`,
    [username, armorId]);
  }

  static async findAll(){
    let res = await db.query(
      `SELECT armor_id
       FROM armors
       WHERE username = $1`
    [username]);
    
    return res.rows;    
  }

  static async remove(username, armorId) {
    const res = await db.query(
      `DELETE
       FROM armors
       WHERE username = $1 AND armor_id = $2
       RETURNING armor_id`, 
      [
        username,
        armorId
      ]);
    if (!res.rows[0]) throw new NotFoundError(`No armor with id ${armorId}`);
  }
}

module.exports = Armor; 