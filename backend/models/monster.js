"use strict"

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

class Monster {

  static async add(id) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monsters
       WHERE id = $1`,
    [id]);

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate monster`);

    const res = await db.query(`
      INSERT INTO monsters
      (id)
      VALUES ($1)
      RETURNING id`,
    [id]);
    
    return res.rows[0];
  }

  static async findAll(){
    let res = await db.query(
                `SELECT id
                FROM monsters`);
    
    return res.rows;    
  }

  static async remove(id) {
    const res = await db.query(
      `DELETE
       FROM monsters
       WHERE id = $1
       returning id`, [id]);
    if (!res.rows[0]) throw new NotFoundError(`No monster with id`);
  }
}

module.exports = Monster; 