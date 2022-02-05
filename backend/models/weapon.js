"use strict"

const db = require("../db");

class Weapon {
  static async create(id, name, type, attack, damageType, slots, attributes, rarity, elderseal, craftable, sharpness, coatings, phial, shelling, ammo, specialAmmo, img) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM weapons
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapons
       (id, name, type, attack, damage_type, slots, attributes, rarity, elderseal, craftable, white_sharpness, coatings, phial, shelling, ammo, special_ammo, img)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
    [id, name, type, attack, damageType, slots, attributes, rarity, elderseal, craftable, sharpness, coatings, phial, shelling, ammo, specialAmmo, img]);
  }

  static async createElement(weaponId, element, damage, hidden) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, element
       FROM weapon_elements
       WHERE weapon_id = $1 AND element = $2`,
    [weaponId, element]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_elements
       (weapon_id, element, damage, hidden)
       VALUES ($1, $2, $3, $4)`,
    [weaponId, element, damage, hidden])
  }

  static async createMaterial(weaponId, itemId, craftOrUpgrade, quantity) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, item_id, craft_or_upgrade
       FROM weapon_materials
       WHERE weapon_id = $1 AND item_id = $2 AND craft_or_upgrade = $3`,
    [weaponId, itemId, craftOrUpgrade]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_materials
       (weapon_id, item_id, craft_or_upgrade, quantity)
       VALUES ($1, $2, $3, $4)`,
    [weaponId, itemId, craftOrUpgrade, quantity])
  }
  
  static async createAmmo(weaponId, type, cap) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, type
       FROM weapon_ammo
       WHERE weapon_id = $1 AND type = $2`,
    [weaponId, type]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_ammo
       (weapon_id, type, capacities)
       VALUES ($1, $2, $3)`,
    [weaponId, type, cap])
  }
}

module.exports = Weapon;