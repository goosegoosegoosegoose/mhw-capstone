"use strict"

const db = require("../db");

class Ailment {
  static async create(id, name, description) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM ailments
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO ailments
       (id, name, description)
       VALUES ($1, $2, $3)
       RETURNING id, name, description`,
    [id, name, description]);
  }
}

module.exports = Ailment;