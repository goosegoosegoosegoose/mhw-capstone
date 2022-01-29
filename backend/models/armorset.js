"use strict"

const db = require("../db");

class ArmorSet {
  static async create(id, name, rank, setBonus) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM armor_sets
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO armor_sets
       (id, name, rank, set_bonus)
       VALUES ($1, $2, $3, $4)`,
    [id, name, rank, setBonus]);
  }

  static async createBonus(id, name) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM set_bonuses
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO set_bonuses
       (id, name)
       VALUES ($1, $2)`,
    [id, name]);
  }

  // pieces as in pieces of armor needed to trigger effect/skill
  static async createSkill(armorSetId, setBonusId, skillLevelId, pieces, description) {
    const duplicateCheck = await db.query(
      `SELECT armor_set_id, set_bonus_id 
       FROM set_skills
       WHERE armor_set_id = $1 AND set_bonus_id = $2`,
    [armorSetId, setBonusId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO set_skills
       (armor_set_id, set_bonus_id, skill_level_id, pieces, description)
       VALUES ($1, $2, $3, $4, $5)`,
    [armorSetId, setBonusId, skillLevelId, pieces, description])
  }
}

module.exports = ArmorSet;