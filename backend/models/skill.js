"use strict"

const db = require("../db");

class Skill {
  static async create(id, name, description) {
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

  static async createLevel(id, skillId, level, modifiers, description) {
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

  static async findLevel(skillId, level) {
    const res = await db.query(
      `SELECT id, skill_id, level, modifiers, description
       FROM skill_levels
       WHERE skill_id = $1 AND level = $2`,
    [skillId, level]);

    return res.rows[0]
  }
}

module.exports = Skill;