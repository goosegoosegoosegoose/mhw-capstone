"use strict"

const db = require("../db");

class Ailment {
  static async insert(id, name, description) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM ailments
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO ailments
       (id, name, description)
       VALUES ($1, $2, $3)`,
    [id, name, description]);
  }
}

module.exports = Ailment;