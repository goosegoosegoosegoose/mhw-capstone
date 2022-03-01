"use strict"

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

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

  static async createSkill(armorSetId, skillId, pieces) {
    const duplicateCheck = await db.query(
      `SELECT armor_set_id, skill_id 
       FROM set_skills
       WHERE armor_set_id = $1 AND skill_id = $2`,
    [armorSetId, skillId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO set_skills
       (armor_set_id, skill_id, pieces)
       VALUES ($1, $2, $3)`,
    [armorSetId, skillId, pieces])
  }

  static async findAll() {
    const res = await db.query(
      `SELECT aa.id AS id, 
              aa.name AS name, 
              aa.rank AS rank, 
              aa.set_bonus AS set_bonus, 
              SUM(a.defense_base) AS total_base,
              SUM(a.defense_max) AS total_max,
              SUM(a.defense_augmented) AS total_augmented
       FROM armor_sets AS aa
       INNER JOIN armor AS a ON aa.id = a.armor_set_id
       GROUP BY aa.id
       ORDER BY aa.id`
    );
    return res.rows;
  }

  static async findArmorSet(id){
    const res = await db.query(
      `SELECT aa.id AS id, 
              aa.name AS name, 
              aa.rank AS rank, 
              aa.set_bonus AS set_bonus, 
              SUM(a.defense_base) AS total_base,
              SUM(a.defense_max) AS total_max,
              SUM(a.defense_augmented) AS total_augmented
      FROM armor_sets AS aa
      INNER JOIN armor AS a ON aa.id = a.armor_set_id
      WHERE aa.id = $1
      GROUP BY aa.id`,
    [id]);
    const armorSet = res.rows[0];
    if (!armorSet) throw new NotFoundError(`Armor set with id ${id} not found`)

    return armorSet;
  }

  static async findSkills(id) {
    const res = await db.query(
      `SELECT s.id AS id, s.name AS name, s.level AS level, s.description AS description
       FROM armor_sets AS a
       INNER JOIN set_skills AS ss ON a.id = ss.armor_set_id
       INNER JOIN skills AS s ON ss.skill_id = s.id
       WHERE a.id = $1`,
    [id]);
    
    return res.rows
  }

  static async findArmor(id) {
    const res = await db.query(
      `SELECT a.id AS id, a.name AS name, a.m_img AS m_img, a.f_img AS f_img
       FROM armor_sets AS aa
       INNER JOIN armor AS a ON aa.id = a.armor_set_id
       WHERE aa.id = $1`,
    [id])

    return res.rows
  }
}

module.exports = ArmorSet;