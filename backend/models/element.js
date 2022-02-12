"use strict"

const db = require("../db");

class Element {
  static async findAll() {
    const res = await db.query(
      `SELECT *
       FROM elements`
    );
    return res.rows;
  }

  static async findElement(element) {
    const res = await db.query(
      `SELECT *
       FROM elements
       WHERE element = $1`,
    [element])
    return res.rows[0];
  }

  static async findWeapons(element) {
    const res = await db.query(
      `SELECT w.id AS id, w.name AS name, w.type AS type, w.attack AS attack, w.affinity AS affinity, w.rarity AS rarity
       FROM elements AS e
       INNER JOIN weapon_elements AS we ON e.element = we.element
       INNER JOIN weapons AS w ON we.weapon_id = w.id
       WHERE e.element = $1`,
    [element]);
    return res.rows;
  }

  static async findMonsters(element) {
    const res = await db.query(
      `SELECT m.id AS id, m.name AS name
       FROM elements as e
       INNER JOIN monster_weaknesses AS mw ON e.element = mw.element
       INNER JOIN monsters AS m ON mw.monster_id = m.id
       WHERE e.element = $1`,
    [element]);
    return res.rows;
  }
}

module.exports = Element;