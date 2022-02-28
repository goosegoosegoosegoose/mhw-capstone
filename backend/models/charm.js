"use strict"

const db = require("../db");

class Charm {
  static async create(id, name, level, rarity) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM charms
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO charms
       (id, name, level, rarity)
       VALUES ($1, $2, $3, $4)`,
    [id, name, level, rarity]);
  }

  static async createSkill(charmId, skillId) {
    const duplicateCheck = await db.query(
      `SELECT charm_id, skill_id
       FROM charm_skills
       WHERE charm_id = $1 AND skill_id = $2`,
    [charmId, skillId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO charm_skills
       (charm_id, skill_id)
       VALUES ($1, $2)`,
    [charmId, skillId]);
  }

  static async createMaterial(charmId, itemId, quantity) {
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

  static async findAll() {
    const res = await db.query(
      `SELECT * 
       FROM charms`
    );
    return res.rows;
  }

  static async findCharm(id) {
    const res = await db.query(
      `SELECT *
       FROM charms
       WHERE id = $1`,
    [id]);
    return res.rows[0];
  }

  static async findSkills(id) {
    const res = await db.query(
      `SELECT s.id AS id, s.name AS name, s.level AS level, s.description AS description
       FROM charms AS c
       INNER JOIN charm_skills AS cs ON c.id = cs.charm_id
       INNER JOIN skills AS s ON cs.skill_id = s.id
       WHERE c.id = $1`,
    [id]);
    return res.rows;
  }

  static async findMaterials(id) {
    const res = await db.query(
      `SELECT i.id AS id, i.name AS name, cm.quantity AS quantity, i.description AS description
       FROM charms AS c
       INNER JOIN charm_materials AS cm ON c.id = cm.charm_id
       INNER JOIN items AS i ON cm.item_id = i.id
       WHERE c.id = $1`,
    [id]);
    return res.rows;
  }

  static async userAdd(username, charmId) {
    const preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, 
    [username]);
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user ${username}`);

    const duplicateCheck = await db.query(
      `SELECT id
       FROM user_charms
       WHERE username = $1 AND charm_id = $2`,
    [username, charmId]);
    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate charm`);

    await db.query(
      `INSERT INTO user_charms
       (username, charm_id)
       VALUES ($1, $2)`,
    [username, charmId]);
  }

  static async userRemove(username, charmId) {
    const res = await db.query(
      `DELETE
       FROM user_charms
       WHERE username = $1 AND charm_id = $2
       RETURNING charm_id`,
    [username, charmId]);
    if (!res.rows[0]) throw new NotFoundError(`No charm with id ${charmId}`);
  }
}

module.exports = Charm;