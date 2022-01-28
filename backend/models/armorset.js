"use strict"

const db = require("../db");

class ArmorSet {
  static async create(id, name, rank) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM armor_sets
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO armor_sets
       (id, name, rank)
       VALUES ($1, $2, $3)`,
    [id, name, rank]);
  }
}

module.exports = ArmorSet;