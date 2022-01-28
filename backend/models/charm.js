"use strict"

const db = require("../db");

class Charm {
  static async create(id, name, level, rarity, craftable) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM charms
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO charms
       (id, name, level, rarity, craftable)
       VALUES ($1, $2, $3, $4, $5)`,
    [id, name, level, rarity, craftable]);
  }

  static async createSkill(charmId, skillLevelId, level) {
    const duplicateCheck = await db.query(
      `SELECT charm_id, skill_level_id
       FROM charm_skills
       WHERE charm_id = $1 AND skill_level_id = $2`,
    [charmId, skillLevelId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO charm_skills
       (charm_id, skill_level_id, level)
       VALUES ($1, $2, $3)`,
    [charmId, skillLevelId, level]);
  }

  static async createMaterial(charmId, itemId, quantity){
    const duplicateCheck = await db.query(
      `SELECT charm_id, item_id
       FROM charm_materials
       WHERE charm_id = $1 AND item_id = $2`,
    [charmId, itemId]);
    if (duplicateCheck.rows[0]) return;
    
    await db.query(
      `INSERT INTO charm_materials
       (charm_id, item_id, quantity)
       VALUES ($1, $2, $3)`,
    [charmId, itemId, quantity]);
  }
}

module.exports = Charm;