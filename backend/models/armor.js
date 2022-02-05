"use strict"

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

class Armor {
  static async create(id, name, type, rank, slots, rarity, defense, armorSetId, mImg, fImg) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM armor
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO armor
       (id, name, type, rank, slots, rarity, defense, armor_set_id, m_img, f_img)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [id, name, type, rank, slots, rarity, defense, armorSetId, mImg, fImg]);
  }

  static async createSkill(armorId, skillLevelId) {
    const duplicateCheck = await db.query(
      `SELECT armor_id, skill_level_id
       FROM armor_skills
       WHERE armor_id = $1 AND skill_level_id = $2`,
    [armorId, skillLevelId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO armor_skills
       (armor_id, skill_level_id)
       VALUES ($1, $2)`,
    [armorId, skillLevelId]);
  }

  static async createMaterial(armorId, itemId, quantity) {
    const duplicateCheck = await db.query(
      `SELECT armor_id, item_id
       FROM armor_materials
       WHERE armor_id = $1 AND item_id = $2`,
    [armorId, itemId]);
    if (duplicateCheck.rows[0]) return;
    
    await db.query(
      `INSERT INTO armor_materials
       (armor_id, item_id, quantity)
       VALUES ($1, $2, $3)`,
    [armorId, itemId, quantity]);
  }

  static async add(username, armorId) {
    const preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user ${username}`);

    const duplicateCheck = await db.query(
      `SELECT id
       FROM armor
       WHERE username = $1 AND armor_id = $2`,
    [
      username, 
      armorId
    ]);
    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate armor`);

    await db.query(
      `INSERT INTO armor
       (username, armor_id)
       VALUES ($1, $2)`,
    [username, armorId]);
  }

  static async findAll(){
    let res = await db.query(
      `SELECT armor_id
       FROM armor
       WHERE username = $1`
    [username]);
    
    return res.rows;    
  }

  static async remove(username, armorId) {
    const res = await db.query(
      `DELETE
       FROM armor
       WHERE username = $1 AND armor_id = $2
       RETURNING armor_id`, 
      [
        username,
        armorId
      ]);
    if (!res.rows[0]) throw new NotFoundError(`No armor with id ${armorId}`);
  }
}

module.exports = Armor; 