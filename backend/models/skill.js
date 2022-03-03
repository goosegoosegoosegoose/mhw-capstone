"use strict"

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Skill {
  static async create(id, name, level, description, cap) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM skills
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO skills
       (id, name, level, description, cap)
       VALUES ($1, $2, $3, $4, $5)`,
    [id, name, level, description, cap]);
  }

  static async findAll() {
    const res = await db.query(
      `SELECT *
       FROM skills`
    );
    return res.rows;
  }

  static async findSkill(id) {
    const res = await db.query(
      `SELECT *
       FROM skills
       WHERE id = $1`,
    [id]);
    const skill =  res.rows[0];
    if (!skill) throw new NotFoundError(`Skill with id ${id} not found`);

    return skill;
  }

  static async findArmorSets(id) {
    const res = await db.query(
      `SELECT aa.id AS id, aa.name AS name, sk.pieces AS pieces
       FROM skills AS s
       INNER JOIN set_skills AS sk ON s.id = sk.skill_id
       INNER JOIN armor_sets AS aa ON sk.armor_set_id = aa.id
       WHERE s.id = $1`,
    [id]);
    return res.rows;
  }

  static async findArmor(id) {
    const res = await db.query(
      `SELECT a.id AS id, a.name AS name, a.m_img AS m_img, a.f_img AS f_img
       FROM skills AS s
       INNER JOIN armor_skills AS aa ON s.id = aa.skill_id
       INNER JOIN armor AS a ON aa.armor_id = a.id
       WHERE s.id = $1`,
    [id]);
    return res.rows;
  }

  static async findCharms(id) {
    const res = await db.query(
      `SELECT c.id AS id, c.name AS name, c.level, c.rarity
       FROM skills AS s
       INNER JOIN charm_skills AS cs ON s.id = cs.skill_id
       INNER JOIN charms AS c ON cs.charm_id = c.id
       WHERE s.id = $1`,
    [id]);
    return res.rows;
  }
  
  static async findDecos(id) {
    const res = await db.query(
      `SELECT d.id AS id, d.name AS name, d.rarity AS rarity, d.slot AS slot
       FROM skills AS s
       INNER JOIN decoration_skills AS ds ON s.id = ds.skill_id
       INNER JOIN decorations AS d ON ds.decoration_id = d.id
       WHERE s.id = $1`,
    [id]);
    return res.rows;
  }
}

module.exports = Skill;