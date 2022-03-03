"use strict"

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

class Weapon {
  static async create(id, name, type, attack, affinity, defense, damageType, slots, rarity, elderseal, img) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM weapons
       WHERE id = $1`,
    [id]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapons
       (id, name, type, attack, affinity, defense, damage_type, slots, rarity, elderseal, img)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [id, name, type, attack, affinity, defense, damageType, slots, rarity, elderseal, img]);
  }

  static async updateAsset(id, img) {
    const duplicateCheck = await db.query(
      `SELECT id
       from weapons
       WHERE id = $1 AND img = $2`,
    [id, img]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `UPDATE weapons
       SET img = $1
       WHERE id = $2`,
    [img, id])
  }

  static async createSharpness(wepId, sharp) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, white_sharpness
       FROM weapon_sharpness
       WHERE weapon_id = $1`,
    [wepId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_sharpness
       (weapon_id, white_sharpness)
       VALUES ($1, $2)`,
    [wepId, sharp])
  }
  
  static async createCoating(wepId, coatings) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, coatings
       FROM weapon_coatings
       WHERE weapon_id = $1`,
    [wepId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_coatings
       (weapon_id, coatings)
       VALUES ($1, $2)`,
    [wepId, coatings])
  }

  static async createPhial(wepId, type, damage) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, phial_type
       FROM weapon_phials
       WHERE weapon_id = $1`,
    [wepId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_phials
       (weapon_id, phial_type, phial_damage)
       VALUES ($1, $2, $3)`,
    [wepId, type, damage])
  }

  static async createShelling(wepId, type, level) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, shelling_type
       FROM weapon_shelling
       WHERE weapon_id = $1`,
    [wepId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_shelling
       (weapon_id, shelling_type, shelling_level)
       VALUES ($1, $2, $3)`,
    [wepId, type, level])
  }

  static async createBoost(wepId, type) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, boost_type
       FROM weapon_boosts
       WHERE weapon_id = $1`,
    [wepId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_boosts
       (weapon_id, boost_type)
       VALUES ($1, $2)`,
    [wepId, type])
  }

  static async createGunSpec(wepId, specialAmmo, deviation) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, special_ammo
       FROM weapon_gunspecs
       WHERE weapon_id = $1`,
    [wepId]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_gunspecs
       (weapon_id, special_ammo, deviation)
       VALUES ($1, $2, $3)`,
    [wepId, specialAmmo, deviation])
  }

  static async createAmmo(wepId, type, cap) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, ammo_type
       FROM weapon_ammo
       WHERE weapon_id = $1 AND ammo_type = $2`,
    [wepId, type]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_ammo
       (weapon_id, ammo_type, capacities)
       VALUES ($1, $2, $3)`,
    [wepId, type, cap])
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

  static async createMaterial(wepId, itemId, craftOrUpgrade, quantity) {
    const duplicateCheck = await db.query(
      `SELECT weapon_id, item_id, craft_or_upgrade
       FROM weapon_materials
       WHERE weapon_id = $1 AND item_id = $2 AND craft_or_upgrade = $3`,
    [wepId, itemId, craftOrUpgrade]);
    if (duplicateCheck.rows[0]) return;

    await db.query(
      `INSERT INTO weapon_materials
       (weapon_id, item_id, craft_or_upgrade, quantity)
       VALUES ($1, $2, $3, $4)`,
    [wepId, itemId, craftOrUpgrade, quantity])
  }

  static async findTypes(search={}) {
    if (!search.type){
      const res = await db.query(
        `SELECT *
         FROM weapon_types`
      );
      return res.rows;
    }
    const res = await db.query(
      `SELECT *
       from weapon_types
       WHERE type ILIKE $1`,
    [`%${search.type}%`]);
    return res.rows;
  }

  static async findOneType(type, search={}) {
    const query = `SELECT w.id AS id, w.name AS name, w.img AS img FROM weapons AS w`;
    const filter = Object.keys(search)[0];
    const value = Object.values(search)[0];
    let join = ``;
    let prefix = "";

    if (type === "bow") {
      join = ` INNER JOIN weapon_coatings AS wc ON w.id = wc.weapon_id`;
      if (filter === "coatings") {
        prefix = "wc."
        const res = await db.query(
          query + join +
          ` WHERE w.type = $1 AND $2 = ANY(${prefix}${filter})`,
        [type, value]);
        return res.rows;
      };
    };
    if (type === "charge-blade" || type === "switch-axe") {
      join = ` INNER JOIN weapon_phials AS wp ON w.id = wp.weapon_id`;
      if (filter === "phial_type" || filter === "phial_damage") {
        prefix = "wp."
      }
    };
    if (type == "gunlance") {
      join = ` INNER JOIN weapon_shelling AS ws ON w.id = ws.weapon_id`;
      if (filter === "shelling_type" || filter === "shelling_level"){
        prefix = "ws."
      }
    };
    if (type === "insect-glaive") {
      join = ` INNER JOIN weapon_boosts AS wb ON w.id = wb.weapon_id`;
      if (filter === "boost_type"){
        prefix = "wb."
      }
    };
    if (type === "light-bowgun" || type === "heavy-bowgun") {
      if (filter === "ammo_type"){
        join = ` INNER JOIN weapon_ammo AS wa ON w.id = wa.weapon_id`
        prefix = "wa."
      } else if (filter === "special_ammo" || filter === "deviation") {
        join = ` INNER JOIN weapon_gunspecs AS wg ON w.id = wg.weapon_id`
        prefix = "wg."
      }
    };

    if (!filter) {
      const res = await db.query(
        query + join +
        ` WHERE w.type = $1
         ORDER BY w.id`,
      [type]);
      return res.rows;
    };
    if (filter === "name") {
      const res = await db.query(
        query + join +
        ` WHERE w.type = $1 AND w.name ILIKE $2
         ORDER BY w.id`,
      [type, `%${value}%`]);
      return res.rows;
    };
    const res = await db.query(
      query + join +
      ` WHERE w.type = $1 and ${prefix}${filter} = $2
       ORDER BY w.id`,
    [type, value]);
    return res.rows;
  }

  static async findWeapon(id){
    const findType = await db.query(
      `SELECT *
       FROM weapons
       WHERE id = $1`,
    [id]);
    if (!findType.rows[0]) throw new NotFoundError(`Weapon with id ${id} not found`);

    const type = findType.rows[0].type;
    const select = `SELECT w.*`;
    let sharp1 = `, s.white_sharpness AS white_sharpness`
    const from = ` FROM weapons AS w`;
    let sharp2 = ` INNER JOIN weapon_sharpness AS s ON w.id = s.weapon_id`;
    let select2 = ``;
    let join = ``;

    if (type === "bow") {
      select2 = `, wc.coatings AS coatings`;
      join = ` INNER JOIN weapon_coatings AS wc ON w.id = wc.weapon_id`;
      sharp1 = ``;
      sharp2 = ``
    };
    if (type === "charge-blade" || type === "switch-axe") {
      select2= `, wp.phial_type AS phial_type`
      if (type === "switch-axe"){
        select2 = select2 + `, wp.phial_damage AS phial_damage`
      };
      join = ` INNER JOIN weapon_phials AS wp ON w.id = wp.weapon_id`
    };
    if (type == "gunlance") {
      select2 = `, ws.shelling_type AS shelling_type, ws.shelling_level as shelling_level`;
      join = ` INNER JOIN weapon_shelling AS ws ON w.id = ws.weapon_id`
    };
    if (type === "insect-glaive") {
      select2 = `, wb.boost_type AS boost_type`;
      join = ` INNER JOIN weapon_boosts AS wb ON w.id = wb.weapon_id`
    };
    if (type === "light-bowgun" || type === "heavy-bowgun") {
      select2 = `, wg.special_ammo AS special_ammo, wg.deviation AS deviation`;
      join = ` INNER JOIN weapon_gunspecs AS wg ON w.id = wg.weapon_id`;
      sharp1 = ``;
      sharp2 = ``
    };

    const res = await db.query(
      select + sharp1 + select2 + from + sharp2 + join + 
      ` WHERE w.id = $1`,
    [id]);
    let weapon = res.rows[0];

    if (type === "light-bowgun" || type === "heavy-bowgun") {
      const ammo = await db.query(
        `SELECT ammo_type, capacities AS ammo_capacity
         FROM weapon_ammo
         WHERE weapon_id = $1`,
      [id])
      weapon.ammo = ammo.rows;
    }
    return weapon;
  }

  static async findElements(id){
    const res = await db.query(
      `SELECT element, damage, hidden
       FROM weapon_elements
       WHERE weapon_id = $1`,
    [id]);
    return res.rows;
  }

  static async findMaterials(id) {
    const res = await db.query(
      `SELECT i.id AS id, i.name AS material, wm.quantity AS quantity, i.description AS description
       FROM weapons AS w
       INNER JOIN weapon_materials AS wm ON w.id = wm.weapon_id
       INNER JOIN items AS i ON wm.item_id = i.id
       WHERE w.id = $1`,
    [id]);
    return res.rows;
  }

  static async userAdd(username, wepId) {
    const preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = preCheck.rows[0];
    if (!user) throw new NotFoundError(`No user ${username}`);

    const duplicateCheck = await db.query(
      `SELECT id
       FROM user_weapons
       WHERE username = $1 AND weapon_id = $2`,
    [
      username, 
      wepId
    ]);
    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate weapon`);

    const res = await db.query(
      `SELECT slots
       FROM weapons
       WHERE id = $1`,
    [wepId]);
    const slots = res.rows[0].slots;
    
    await db.query(
      `INSERT INTO user_weapons
       (username, weapon_id, slots)
       VALUES ($1, $2, $3)`,  
    [username, wepId, slots]);
  }

  static async userRemove(username, wepId) {
    const res = await db.query(
      `DELETE
       FROM user_weapons
       WHERE username = $1 AND weapon_id = $2
       RETURNING weapon_id`,
      [
        username,
        wepId
      ]);
    if (!res.rows[0]) throw new NotFoundError(`No weapon with id ${wepId}`);
  }
}

module.exports = Weapon;