"use strict"

const db = require("../db");

class Item {
  static async insert(id, name, description, rarity, carryLimit, value) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM items
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO items
       (id, name, description, rarity, carry_limit, value)
       VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, name, description, rarity, carryLimit, value]);
  }
}

module.exports = Item;