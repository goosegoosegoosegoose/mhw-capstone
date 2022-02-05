"use strict"

const db = require("../db");

class Decoration {
  static async create(id, name, rarity, slot) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM decorations
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO decorations
       (id, name, rarity, slot)
       VALUES ($1, $2, $3, $4)`,
    [id, name, rarity, slot])
  }

  static async createSkill(decoId, skillLvlId) {
    const duplicateCheck = await db.query(
      `SELECT decoration_id, skill_level_id
       FROM decoration_skills
       WHERE decoration_id = $1 AND skill_level_id = $2`,
    [decoId, skillLvlId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO decoration_skills
       (decoration_id, skill_level_id)
       VALUES ($1, $2)`,
    [decoId, skillLvlId])
  }
}

module.exports = Decoration;