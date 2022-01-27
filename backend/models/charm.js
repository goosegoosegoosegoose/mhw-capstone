"use strict"

const db = require("../db");

class Charm {
  static async insert(id, name) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM charms
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO charms
       (id, name, rank)
       VALUES ($1, $2)`,
    [id, name]);
  }
}

module.exports = Charm;