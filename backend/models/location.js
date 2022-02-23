"use strict"

const db = require("../db");

class Location {
  static async create(id, name, zoneCount, camps) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM locations
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO locations
       (id, name, zone_count, camps)
       VALUES ($1, $2, $3, $4)`,
    [id, name, zoneCount, camps]);
  }

  static async updateAsset(id, icon, imgs) {
    const duplicateCheck = await db.query(
      `SELECT icon
       FROM locations
       WHERE icon = $1`,
    [icon]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `UPDATE locations
       SET icon = $1, imgs = $2
       WHERE id = $3`,
    [icon, imgs, id])
  }

  static async findAll(search = {}) {
    const query = `SELECT * FROM locations`;
    const filter = Object.keys(search)[0];
    const value = Object.values(search)[0];

    if (!filter) {
      const res = await db.query(query);
      return res.rows;
    };
    
    const res = await db.query(
      query +
      ` WHERE name ILIKE $1`,
    [`%${value}%`]);
    return res.rows;
  }

  static async findLocation(id) {
    const res = await db.query(
      `SELECT *
       FROM locations
       WHERE id = $1`,
    [id]);

    return res.rows[0];
  }

  static async findMonsters(id) {
    const res = await db.query(
      `SELECT m.id AS id, m.name AS name, m.icon AS icon
       FROM locations AS l
       INNER JOIN monster_locations AS ml ON l.id = ml.location_id
       INNER JOIN monsters AS m ON ml.monster_id = m.id
       WHERE l.id = $1`,
    [id]);

    return res.rows;
  }
}

module.exports = Location;