"use strict"

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

class Monster {
  static async create(id, name, type, species, description){
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monsters
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;
 
    await db.query(
      `INSERT INTO monsters
       (id, name, type, species, description)
       VALUES ($1, $2, $3, $4, $5)`,
    [id, name, type, species, description]);
  }

  static async updateAsset(id, icon, img) {
    const preCheck = await db.query(
      `SELECT icon
       FROM monsters
       WHERE icon = $1`,
    [icon]);
    if (preCheck.rows[0]) return;

    await db.query(
      `UPDATE monsters
       SET icon = $1, img = $2
       WHERE id = $3`,
    [icon, img, id])
  }

  static async createLocation(monId, locId) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_locations
       WHERE monster_id = $1 AND location_id = $2`,
    [monId, locId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_locations
       (monster_id, location_id)
       VALUES ($1, $2)`,
    [monId, locId])
  }

  static async createWeakness(monId, ele, stars, cond) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_weaknesses
       WHERE monster_id = $1 AND element = $2`,
    [monId, ele]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_weaknesses
       (monster_id, element, stars, condition)
       VALUES ($1, $2, $3, $4)`,
    [monId, ele, stars, cond])
  }

  static async createAilment(monId, ailId) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_ailments
       WHERE monster_id = $1 AND ailment_id = $2`,
    [monId, ailId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_ailments
       (monster_id, ailment_id)
       VALUES ($1, $2)`,
    [monId, ailId])
  }

  static async createMaterial(id, monId, itemId) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_materials
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_materials
       (id, monster_id, item_id)
       VALUES ($1, $2, $3)`,
    [id, monId, itemId])
  }

  static async createConditions(mmId, type, rank, quant, chance, subtype) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM monster_material_conditions
       WHERE monster_material_id = $1 AND type = $2`,
    [mmId, type]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO monster_material_conditions
       (monster_material_id, type, rank, quantity, chance, subtype)
       VALUES ($1, $2, $3, $4, $5, $6)`,
    [mmId, type, rank, quant, chance, subtype])
  }

  static async findAll(search = {}) {
    const query = `SELECT * FROM monsters`;
    const filter = Object.keys(search)[0];
    const value = Object.values(search)[0];

    if (!filter) {
      const res = await db.query(query + ` ORDER BY id`);
      return res.rows;
    };
    
    if (search.name) {
      const res = await db.query(
        query +
        ` WHERE name ILIKE $1
         ORDER BY id`,
      [`%${value}%`]);
      return res.rows;
    };

    const res = await db.query(
      query +
      ` WHERE ${filter} = $1
       ORDER BY id`,
    [value]);
    return res.rows;
  }

  static async findMonster(id) {
    const res = await db.query(
      `SELECT *
       FROM monsters
       WHERE id = $1
       ORDER BY id`,
    [id]);
    const monster = res.rows[0];
    if (!monster) throw new NotFoundError(`Monster with id ${id} not found`)

    return monster;
  }

  static async findLocations(id){
    const res = await db.query(
      `SELECT l.id AS id, l.name AS location 
       FROM monsters AS m 
       INNER JOIN monster_locations AS ml ON m.id = ml.monster_id 
       INNER JOIN locations AS l ON ml.location_id = l.id 
       WHERE m.id = $1`,
    [id]);

    return res.rows;
  }

  static async findWeaknesses(id){
    const res = await db.query(
      `SELECT e.element AS element, mw.condition AS condition, mw.stars AS stars
       FROM monsters AS m 
       INNER JOIN monster_weaknesses AS mw ON m.id = mw.monster_id 
       INNER JOIN elements AS e ON mw.element = e.element 
       WHERE m.id = $1
       ORDER BY stars DESC`,
    [id]);

    return res.rows;
  }

  static async findAilments(id){
    const res = await db.query(
      `SELECT a.id AS id, a.name AS ailment, a.description AS description
       FROM monsters AS m 
       INNER JOIN monster_ailments AS ma ON m.id = ma.monster_id 
       INNER JOIN ailments AS a ON ma.ailment_id = a.id 
       WHERE m.id = $1`,
    [id]);

    return res.rows;
  }

  static async findMaterials(id){
    const res = await db.query(
      `SELECT i.id AS id, 
              i.name AS material,
              c.type AS type, 
              c.rank AS rank, 
              c.quantity AS quantity, 
              c.chance AS chance,
              c.subtype AS subtype
       FROM monsters AS m 
       INNER JOIN monster_materials AS mm ON m.id = mm.monster_id 
       INNER JOIN items AS i ON mm.item_id = i.id
       INNER JOIN monster_material_conditions AS c ON mm.id = c.monster_material_id
       WHERE m.id = $1`,
    [id]);

    return res.rows;
  }

  static async userAdd(username, monId) {
    const preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user ${username}`);

    const duplicateCheck = await db.query(
      `SELECT monster_id
       FROM user_monsters
       WHERE username = $1 AND monster_id = $2`,
    [username, monId]);
    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate monster`);

    const res = await db.query(`
      INSERT INTO user_monsters
      (username, monster_id)
      VALUES ($1, $2)`,
    [username, monId]);
    
    return res.rows[0];
  }

  static async userRemove(username, monId) {
    const res = await db.query(
      `DELETE
       FROM user_monsters
       WHERE username = $1 AND monster_id = $2
       RETURNING monster_id`,
    [username, monId]);
    if (!res.rows[0]) throw new NotFoundError(`No monster with id`);
  }
}

module.exports = Monster; 