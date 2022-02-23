"use strict"

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

class Armor {
  static async create(id, name, type, rank, slots, rarity, defenseBase, defenseMax, defenseAugmented, armorSetId, mImg, fImg) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM armor
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO armor
       (id, name, type, rank, slots, rarity, defense_base, defense_max, defense_augmented, armor_set_id, m_img, f_img)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [id, name, type, rank, slots, rarity, defenseBase, defenseMax, defenseAugmented, armorSetId, mImg, fImg]);
  }

  static async createSkill(armorId, skillId) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM armor_skills
       WHERE armor_id = $1 AND skill_id = $2`,
    [armorId, skillId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO armor_skills
       (armor_id, skill_id)
       VALUES ($1, $2)`,
    [armorId, skillId]);
  }

  static async createMaterial(armorId, itemId, quantity) {
    const duplicateCheck = await db.query(
      `SELECT id
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

  static async findAll(search = {}) {
    const query = `SELECT id, name, m_img, f_img
                   FROM armor`;
    const filter = Object.keys(search)[0];
    const value = Object.values(search)[0];

    if (!filter) {
      const res = await db.query(query);
      return res.rows;
    };
    
    if (search.name) {
      const res = await db.query(
        query +
        ` WHERE name ILIKE $1`,
      [`%${value}%`]);
      return res.rows;
    };

    const res = await db.query(
      query +
      ` WHERE ${filter} = $1`,
    [value]);
    return res.rows;
  }

  static async findArmor(id){
    const res = await db.query(
      `SELECT *
       FROM armor
       WHERE id = $1`,
    [id]);

    return res.rows[0];
  }

  static async findArmorSet(id){
    const res = await db.query(
      `SELECT s.id AS id, s.name AS name
       FROM armor AS a
       INNER JOIN armor_sets AS s ON a.armor_set_id = s.id
       WHERE a.id = $1`,
    [id]);

    return res.rows[0];
  }

  static async findSkills(id) {
    const res = await db.query(
      `SELECT s.id AS id, s.name AS name
       FROM armor AS a
       INNER JOIN armor_skills AS ak ON a.id = ak.armor_id
       INNER JOIN skills AS s ON ak.skill_id = s.id
       WHERE a.id = $1`,
    [id]);

    return res.rows;
  }

  static async findMaterials(id) {
    const res = await db.query(
      `SELECT i.id AS id, i.name AS material, am.quantity AS quantity, i.description AS description
       FROM armor AS a
       INNER JOIN armor_materials AS am ON a.id = am.armor_id
       INNER JOIN items AS i ON am.item_id = i.id
       WHERE a.id = $1`,
    [id]);

    return res.rows;
  }

  static async userAll(){
    let res = await db.query(
      `SELECT armor_id
       FROM user_armor
       WHERE username = $1`
    [username]);
    return res.rows;    
  }

  static async userAdd(username, armorId) {
    const preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user ${username}`);

    const duplicateCheck = await db.query(
      `SELECT id
       FROM user_armor
       WHERE username = $1 AND armor_id = $2`,
    [
      username, 
      armorId
    ]);
    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate armor`);

    const res = await db.query(
      `SELECT slots
       FROM armor
       WHERE id = $1`,
    [armorId]);
    const slots = res.rows[0].slots;
    
    await db.query(
      `INSERT INTO user_armor
       (username, armor_id, slots)
       VALUES ($1, $2, $3)`,
    [username, armorId, slots]);
  }

  static async userRemove(username, armorId) {
    const res = await db.query(
      `DELETE
       FROM user_armor
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