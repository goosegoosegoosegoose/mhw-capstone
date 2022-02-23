"use strict"

const db = require("../db");

class Item {
  static async create(id, name, description, rarity) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM items
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO items
       (id, name, description, rarity)
       VALUES ($1, $2, $3, $4)`,
    [id, name, description, rarity]);
  }
}

module.exports = Item;