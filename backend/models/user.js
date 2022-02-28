"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {

  static async authenticate(username, password) {
    const result = await db.query(
          `SELECT username,
                  password,
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  static async register(
      { username, password, email, isAdmin }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4)
           RETURNING username, email, is_admin AS "isAdmin"`,
        [
          username,
          hashedPassword,
          email,
          isAdmin,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  static async findAll() {
    const result = await db.query(
          `SELECT username,
                  email,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY username`,
    );

    return result.rows;
  }

  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
              email,
              is_admin AS "isAdmin"
        FROM users
        WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userArmorRes = await db.query(
      `SELECT armor_id
       FROM user_armor
       WHERE username = $1`,
    [username]);
    user.armor = userArmorRes.rows.map(a => a.armor_id);

    const userWeaponsRes = await db.query(
      `SELECT weapon_id
       FROM user_weapons
       WHERE username = $1`,
    [username]);
    user.weapons = userWeaponsRes.rows.map(w => w.weapon_id);
   
    const userCharmsRes = await db.query(
      `SELECT charm_id
       FROM user_charms
       WHERE username = $1`,
    [username]);
    user.charms = userCharmsRes.rows.map(c => c.charm_id);

    const userDecorationsRes = await db.query(
      `SELECT decoration_id, COUNT(decoration_id) as count
       FROM user_decorations
       WHERE username = $1
       GROUP BY decoration_id`,
    [username]);
    user.decorations = {};
    userDecorationsRes.rows.map(d => user.decorations[d.decoration_id] = Number(d.count));

    const userMonstersRes = await db.query(
      `SELECT monster_id
       FROM user_monsters
       WHERE username = $1`,
    [username]);
    user.monsters = userMonstersRes.rows.map(m => m.monster_id);

    return user;
  }

  static async getAll(username) {
    const userRes = await db.query(
      `SELECT username,
              email
        FROM users
        WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const armorRes = await db.query(
      `SELECT a.id AS id, a.name AS name, a.m_img AS m_img, a.f_img AS f_img
       FROM user_armor AS ua
       INNER JOIN armor AS a ON ua.armor_id = a.id
       WHERE ua.username = $1`,
    [username]);
    user.armor = armorRes.rows;

    const weaponsRes = await db.query(
      `SELECT w.id AS id, w.name AS name, w.img AS img
       FROM user_weapons AS uw
       INNER JOIN weapons AS w ON uw.weapon_id = w.id
       WHERE uw.username = $1`,
    [username]);
    user.weapons = weaponsRes.rows;
   
    const charmsRes = await db.query(
      `SELECT c.*
       FROM user_charms AS uc
       INNER JOIN charms AS c ON uc.charm_id = c.id
       WHERE username = $1`,
    [username]);
    user.charms = charmsRes.rows;

    const decorationsRes = await db.query(
      `SELECT d.*, COUNT(ud.decoration_id)
       FROM user_decorations AS ud
       INNER JOIN decorations AS d ON ud.decoration_id = d.id
       WHERE username = $1
       GROUP BY d.id`,
    [username]);
    user.decorations = decorationsRes.rows;

    const monstersRes = await db.query(
      `SELECT m.id AS id, m.name AS name, m.icon AS icon
       FROM user_monsters AS um
       INNER JOIN monsters AS m ON um.monster_id = m.id
       WHERE um.username = $1`,
    [username]);
    user.monsters = monstersRes.rows;

    return user;
  }

  static async getGear(username) {
    const userRes = await db.query(
      `SELECT username,
              email
        FROM users
        WHERE username = $1`,
      [username],
    );
    if (!userRes.rows[0]) throw new NotFoundError(`No user: ${username}`);

    const gear = {"decorations":{}};

    const headRes = await db.query(
      `SELECT a.id AS id,
              a.name AS name, 
              a.defense_base AS defense_base, 
              a.defense_max AS defense_max, 
              a.defense_augmented AS defense_augmented, 
              ua.slots AS slots
       FROM user_armor AS ua
       INNER JOIN armor AS a ON ua.armor_id = a.id
       WHERE ua.username = $1 AND a.type = 'head'
       ORDER BY id`,
    [username]);
    gear.head = headRes.rows;

    const chestRes = await db.query(
      `SELECT a.id AS id,
              a.name AS name, 
              a.defense_base AS defense_base, 
              a.defense_max AS defense_max, 
              a.defense_augmented AS defense_augmented, 
              ua.slots AS slots
       FROM user_armor AS ua
       INNER JOIN armor AS a ON ua.armor_id = a.id
       WHERE ua.username = $1 AND a.type = 'chest'
       ORDER BY id`,
    [username]);
    gear.chest = chestRes.rows;

    const glovesRes = await db.query(
      `SELECT a.id AS id,
              a.name AS name, 
              a.defense_base AS defense_base, 
              a.defense_max AS defense_max, 
              a.defense_augmented AS defense_augmented, 
              ua.slots AS slots
       FROM user_armor AS ua
       INNER JOIN armor AS a ON ua.armor_id = a.id
       WHERE ua.username = $1 AND a.type = 'gloves'
       ORDER BY id`,
    [username]);
    gear.gloves = glovesRes.rows;

    const waistRes = await db.query(
      `SELECT a.id AS id,
              a.name AS name, 
              a.defense_base AS defense_base, 
              a.defense_max AS defense_max, 
              a.defense_augmented AS defense_augmented, 
              ua.slots AS slots
       FROM user_armor AS ua
       INNER JOIN armor AS a ON ua.armor_id = a.id
       WHERE ua.username = $1 AND a.type = 'waist'
       ORDER BY id`,
    [username]);
    gear.waist = waistRes.rows;

    const legsRes = await db.query(
      `SELECT a.id AS id,
              a.name AS name, 
              a.defense_base AS defense_base, 
              a.defense_max AS defense_max, 
              a.defense_augmented AS defense_augmented, 
              ua.slots AS slots
       FROM user_armor AS ua
       INNER JOIN armor AS a ON ua.armor_id = a.id
       WHERE ua.username = $1 AND a.type = 'legs'
       ORDER BY id`,
    [username]);
    gear.legs = legsRes.rows;

    const weaponsRes = await db.query(
      `SELECT w.id AS id,
              w.name AS name,
              w.type AS type,
              w.attack AS attack, 
              w.affinity AS affinity, 
              w.defense AS defense, 
              w.damage_type AS damage_type, 
              w.elderseal AS elderseal, 
              ws.white_sharpness AS white_sharpness,
              wc.coatings AS coatings,
              wp.phial_type AS phial_type,
              wp.phial_damage AS phial_damage,
              wl.shelling_type AS shelling_type,
              wl.shelling_level AS shelling_level,
              wb.boost_type AS boost_type,
              wg.special_ammo AS special_ammo,
              wg.deviation AS deviation,
              (SELECT ARRAY_AGG(we.element) FROM weapon_elements AS we WHERE we.weapon_id = uw.weapon_id) AS element,
              (SELECT ARRAY_AGG(we.damage) FROM weapon_elements AS we WHERE we.weapon_id = uw.weapon_id) AS element_damage,
              (SELECT ARRAY_AGG(we.hidden) FROM weapon_elements AS we WHERE we.weapon_id = uw.weapon_id) AS hidden,
              (SELECT ARRAY_AGG(wa.ammo_type) FROM weapon_ammo AS wa WHERE wa.weapon_id = uw.weapon_id) AS ammo_types,
              uw.slots AS slots
       FROM user_weapons AS uw
       INNER JOIN weapons AS w ON uw.weapon_id = w.id
       LEFT JOIN weapon_sharpness AS ws ON uw.weapon_id = ws.weapon_id
       LEFT JOIN weapon_coatings AS wc ON uw.weapon_id = wc.weapon_id
       LEFT JOIN weapon_phials AS wp ON uw.weapon_id = wp.weapon_id
       LEFT JOIN weapon_shelling AS wl ON uw.weapon_id = wl.weapon_id
       LEFT JOIN weapon_boosts AS wb ON uw.weapon_id = wb.weapon_id
       LEFT JOIN weapon_gunspecs AS wg ON uw.weapon_id = wg.weapon_id
       WHERE uw.username = $1
       ORDER BY id`,
    [username]);
    gear.weapons = weaponsRes.rows;
   
    const charmsRes = await db.query(
      `SELECT c.id AS id, c.name AS name,
                          (SELECT ARRAY_AGG(s.name) FROM skills AS s INNER JOIN charm_skills AS cs ON s.id = cs.skill_id WHERE cs.charm_id = uc.charm_id) AS skills,
                          (SELECT ARRAY_AGG(s.cap) FROM skills AS s INNER JOIN charm_skills AS cs ON s.id = cs.skill_id WHERE cs.charm_id = uc.charm_id) AS skill_caps
       FROM user_charms AS uc
       INNER JOIN charms AS c ON uc.charm_id = c.id
       WHERE uc.username = $1`,
    [username]);
    gear.charms = charmsRes.rows;

    const decoLevel1Res = await db.query(
      `SELECT d.id AS id, 
              d.name AS name, 
              d.slot AS slot,
              (SELECT ARRAY_AGG(s.name) FROM skills AS s INNER JOIN decoration_skills AS ds ON s.id = ds.skill_id WHERE ds.decoration_id = ud.decoration_id) AS skills,
              (SELECT ARRAY_AGG(s.cap) FROM skills AS s INNER JOIN decoration_skills AS ds ON s.id = ds.skill_id WHERE ds.decoration_id = ud.decoration_id) AS skill_caps
       FROM user_decorations AS ud
       INNER JOIN decorations AS d ON ud.decoration_id = d.id
       WHERE ud.username = $1 AND d.slot = 1`,
    [username]);
    gear.decorations["1"] = decoLevel1Res.rows;

    const decoLevel2Res = await db.query(
      `SELECT d.id AS id, 
              d.name AS name, 
              d.slot AS slot,
              (SELECT ARRAY_AGG(s.name) FROM skills AS s INNER JOIN decoration_skills AS ds ON s.id = ds.skill_id WHERE ds.decoration_id = ud.decoration_id) AS skills,
              (SELECT ARRAY_AGG(s.cap) FROM skills AS s INNER JOIN decoration_skills AS ds ON s.id = ds.skill_id WHERE ds.decoration_id = ud.decoration_id) AS skill_caps
       FROM user_decorations AS ud
       INNER JOIN decorations AS d ON ud.decoration_id = d.id
       WHERE ud.username = $1 AND d.slot = 2`,
    [username]);
    gear.decorations["2"] = decoLevel2Res.rows

    const decoLevel3Res = await db.query(
      `SELECT d.id AS id, 
              d.name AS name, 
              d.slot AS slot,
              (SELECT ARRAY_AGG(s.name) FROM skills AS s INNER JOIN decoration_skills AS ds ON s.id = ds.skill_id WHERE ds.decoration_id = ud.decoration_id) AS skills,
              (SELECT ARRAY_AGG(s.cap) FROM skills AS s INNER JOIN decoration_skills AS ds ON s.id = ds.skill_id WHERE ds.decoration_id = ud.decoration_id) AS skill_caps
       FROM user_decorations AS ud
       INNER JOIN decorations AS d ON ud.decoration_id = d.id
       WHERE ud.username = $1 AND d.slot = 3`,
    [username]);
    gear.decorations["3"] = decoLevel3Res.rows

    const decoLevel4Res = await db.query(
      `SELECT d.id AS id, 
              d.name AS name, 
              d.slot AS slot,
              (SELECT ARRAY_AGG(s.name) FROM skills AS s INNER JOIN decoration_skills AS ds ON s.id = ds.skill_id WHERE ds.decoration_id = ud.decoration_id) AS skills,
              (SELECT ARRAY_AGG(s.cap) FROM skills AS s INNER JOIN decoration_skills AS ds ON s.id = ds.skill_id WHERE ds.decoration_id = ud.decoration_id) AS skill_caps
       FROM user_decorations AS ud
       INNER JOIN decorations AS d ON ud.decoration_id = d.id
       WHERE ud.username = $1 AND d.slot = 4`,
    [username]);
    gear.decorations["4"] = decoLevel4Res.rows

    return gear;
  }

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          isAdmin: "is_admin",
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                email,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;