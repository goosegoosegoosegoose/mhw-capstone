"use strict"

const db = require("../db");

class Skill {
  static async insert(id, name, description) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM skills
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO skills
       (id, name, description)
       VALUES ($1, $2, $3)`,
    [id, name, description]);
  }

  static async insertLevels(id, skillId, level, modifiers, description) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM skill_levels
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO skill_levels
       (id, skill_id, level, modifiers, description)
       VALUES ($1, $2, $3, $4, $5)`,
    [id, skillId, level, modifiers, description]);
  }
}

module.exports = Skill;