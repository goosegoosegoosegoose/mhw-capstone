"use strict"

const db = require("../db");

class Weapon {
  static async create(id, name, type, attack, damageType, rarity, elderseal, craftable) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM armor_sets
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapons
       (id, name, type, attack, damage_type, rarity, elderseal, craftable, img)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
    [id, name, type, attack, damageType, rarity, elderseal, craftable]);
  }
}

module.exports = Weapon;