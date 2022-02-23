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

  static async createSkill(decoId, skillId) {
    const duplicateCheck = await db.query(
      `SELECT decoration_id, skill_id
       FROM decoration_skills
       WHERE decoration_id = $1 AND skill_id = $2`,
    [decoId, skillId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO decoration_skills
       (decoration_id, skill_id)
       VALUES ($1, $2)`,
    [decoId, skillId])
  }

  static async findAll(){
    const res = await db.query(
      `SELECT *
       FROM decorations`
    );
    return res.rows;
  }

  static async findDecoration(id) {
    const res = await db.query(
      `SELECT *
       FROM decorations
       WHERE id = $1`,
    [id]);
    return res.rows[0];
  }

  static async findSkills(id) {
    const res = await db.query(
      `SELECT s.id AS id, s.name AS name, s.level AS level, s.description AS description
       FROM decorations AS d
       INNER JOIN decoration_skills AS ds ON d.id = ds.decoration_id
       INNER JOIN skills AS s ON ds.skill_id = s.id
       WHERE d.id = $1`,
    [id]);
    return res.rows;
  }

  static async userAll(){
    let res = await db.query(
      `SELECT decoration_id
       FROM user_decorations
       WHERE username = $1`,
    [username]);
    return res.rows;    
  }

  static async userAdd(username, decoId) {
    const preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, 
    [username]);
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user ${username}`);

    await db.query(
      `INSERT INTO user_decorations
       (username, decoration_id)
       VALUES ($1, $2)`,
    [username, decoId]);
  }

  static async userRemove(username, decoId) {
    const res = await db.query(
      `DELETE FROM user_decorations
       WHERE id IN (
         SELECT id
         FROM user_decorations
         WHERE username = $1 AND decoration_id = $2
         ORDER BY id
         LIMIT 1
       )
       RETURNING decoration_id`,
    [username, decoId]);
    if (!res.rows[0]) throw new NotFoundError(`No more decorations with id ${decoId}`);
  }
}

module.exports = Decoration;