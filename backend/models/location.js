"use strict"

const db = require("../db");

class Location {
  static async insert(id, name, zoneCount, camps) {
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
}

module.exports = Location;