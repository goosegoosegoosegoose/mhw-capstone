const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM locations");
  await db.query("DELETE FROM items");
  await db.query("DELETE FROM skills");
  await db.query("DELETE FROM ailments");
  await db.query("DELETE FROM armor_sets");
  await db.query("DELETE FROM monsters");
  await db.query("DELETE FROM charms");
  await db.query("DELETE FROM decorations");
  await db.query("DELETE FROM weapon_types");

  await db.query(`
    INSERT INTO locations(id, name, zone_count, camps, icon, imgs)
    VALUES (1, L1, 1, $1, 'http://L1.icon', $2),
           (2, L2, 2, $3, 'http://L2.icon', $4),
           (3, L3, 3, $5, 'http://L3.icon', $6)`,
    [
      ['camp1'],
      ['http://L1.img'],
      ['camp2'],
      ['http://L2.img'],
      ['camp3'],
      ['http://L3.img']
    ]);

  await db.query(`
    INSERT INTO items (id, name, description, rarity)
    VALUES (1, 'i1', 'testi1', 1),
           (2, 'i2', 'testi2', 2)`);

  await db.query(`
    INSERT INTO skills (id, name, level, description, cap)
    VALUES (1, 's1', 1, 'tests1', 1),
           (2, 's2', 2, 'tests2', 2)`);

  // await db.query(`
  //   INSERT INTO ailments (id, name, description)
  //   VALUES (1, 'a1', 'testa1'),
  //          (2, 'a2', 'testa2')`);

  await db.query(`
    INSERT INTO armor_sets (id, name, rank, set_bonus)
    VALUES (1, 'as1', 1, 'testbonusas1'),
           (2, 'as2', 2, 'testbonusas2')`);

  await db.query(`
    INSERT INTO set_skills (armor_set_id, skill_id, pieces)
    VALUES (1, 1, 1),
           (2, 2, 2)`);

  await db.query(`
    INSERT INTO armor (id, name, type, rank, slots, rarity, defense_base, defense_max, defense_augmented, armor_set_id, m_img, f_img)
    VALUES (1, 'a1', 'testtypea1', 'testranka1', $1, 1, 1, 1, 1, 1, 'testa1m', 'testa1f'),
           (2, 'a2', 'testtypea2', 'testranka2', $2, 2, 2, 2, 2, 2, 'testa2m', 'testa2f')`,
    [{1:1}, {1:2}]);

  await db.query(`
    INSERT INTO armor_skills (armor_id, skill_id)
    VALUES (1, 1),
           (2, 2)`);

  await db.query(`
    INSERT INTO armor_materials (armor_id, item_id, quantity)
    VALUES (1, 1, 1),
           (2, 2, 2)`);

  await db.query(`
    INSERT INTO monsters (id, name, type, species, description, icon, img)
    VALUES (1, 'm1', 'testtypem1', 'testspeciesm1', 'testm1', 'http://m1.icon', 'http://m1.img'),
           (2, 'm2', 'testtypem2', 'testspeciesm2', 'testm2', 'http://m2.icon', 'http://m2.img')`);

  await db.query(`
      INSERT INTO monster_locations (monster_id, location_id)
      VALUES (1, 1),
             (2, 2)`);           
            
  await db.query(`
      INSERT INTO monster_weaknesses (monster_id, element, stars, condition)
      VALUES (1, 'fire', 1, 'testcond1'),
             (2, 'water', 2, 'testcond2')`);

  await db.query(`
      INSERT INTO monster_ailments (monster_id, ailment_id)
      VALUES (1, 1),
             (2, 2)`);

  await db.query(`
      INSERT INTO monster_materials (id, monster_id, item_id)
      VALUES (1, 1, 1),
             (2, 2, 2)`);

  await db.query(`
      INSERT INTO monster_material_conditions (monster_material_id, type, rank, quantity, chance, subtype)
      VALUES (1, 'testtypec1', 1, 1, 10, 'test'),
             (2, 'testtypec2', 2, 2, 20, $1)`, [null]);

  await db.query(`
      INSERT INTO charms (id, name, level, rarity)
      VALUES (1, 'c1', 1, 1)
             (2, 'c2', 2, 2)`);

  await db.query(`
      INSERT INTO charm_skills (charm_id, skill_id)
      VALUES (1, 1)
             (2, 2)`);
             
  await db.query(`
      INSERT INTO charm_materials (charm_id, item_id, quantity)
      VALUES (1, 1, 1)
             (2, 2, 2)`);
             
  await db.query(`
      INSERT INTO decorations (id, name, rarity, slot)
      VALUES (1, 'd1', 1, 1)
             (2, 'd2', 2, 2)`);

  await db.query(`
      INSERT INTO decoration_skill (decoration_id, skill_id)
      VALUES (1, 1)
             (2, 2)`);

  await db.query(`
      INSERT INTO weapon_types (type, img)
      VALUES ('t1', 'http://t1.img')
             ('t2', 'http://t2.img')
             ('t3', 'http://t3.img')`);      

  await db.query(`
      INSERT INTO weapons (id, name, type, attack, affinity, defense, damage_type, slots, rarity, elderseal, img)
      VALUES (1, 'w1', 'testtypew1', 1, 1, 1, 'testdmg1', $1, 1, 'testseal1', 'http://w1.img')
             (2, 'w2', 'testtypew2', 2, 2, 2, 'testdmg2', $2, 2, 'testseal2', 'http://w2.img')`
      [{1:1}, {1:2}]);

  await db.query(`
      INSERT INTO weapon_sharpness (weapon_id, white_sharpness)
      VALUES (1, $1)
             (2, $2)`,
      [[1], [2]]);

  await db.query(`
      INSERT INTO weapon_coatings (weapon_id, coatings)
      VALUES (1, $1)
             (2, $2)`,
      [[1], [2]]);

  await db.query(`
      INSERT INTO weapon_phials (weapon_id, phial_type, phial_damage)
      VALUES (1, 'testphial1', 1)
             (2, 'testphial2', 2)`);

  await db.query(`
      INSERT INTO weapon_shelling (weapon_id, shelling_type, shelling_level)
      VALUES (1, 'testshell1', 1)
             (2, 'testshell2', 2)`);

  await db.query(`
      INSERT INTO weapon_boosts (weapon_id, boost_type)
      VALUES (1, 'testboost1')
             (2, 'testboost2')`);             

  await db.query(`
      INSERT INTO weapon_gunspecs (weapon_id, special_ammo, deviation)
      VALUES (1, 'testspecialammo1', 'testdeviation1')
             (2, 'testspecialammo2', 'testdeviation2')`);             
                
  await db.query(`
      INSERT INTO weapon_ammo (weapon_id, ammo_type, capacities)
      VALUES (1, 'testammo1', $1)
             (2, 'testammo2', $2)`);
  
  await db.query(`
      INSERT INTO weapon_elements (weapon_id, element, damage, hidden)
      VALUES (1, 'testelement1', 1, true)
             (2, 'testelement2', 2, false)`);

  await db.query(`
      INSERT INTO weapon_materials (weapon_id, item_id, craft_or_upgrade, quantity)
      VALUES (1, 1, 'craft', 1)
             (2, 2, 'upgrade', 2)`);

  await db.query(`
      INSERT INTO users (username,
                        password,
                        email)
      VALUES ('u1', $1, 'u1@email.com'),
            ('u2', $2, 'u2@email.com')
      RETURNING username`,
  [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
  ]);

  await db.query(`
      INSERT INTO user_armor (username, armor_id, slots)
      VALUES ('u1', 1, $1)
            ('u2', 2, $2)`,
    [{1:1}, {1:2}]);

  await db.query(`
      INSERT INTO user_weapons (username, weapon_id, slots)
      VALUES ('u1', 1, $1)
            ('u2', 2, $2)`,
    [{1:1}, {1:2}]);

  await db.query(`
      INSERT INTO user_charms (username, charm_id)
      VALUES ('u1', 1)
            ('u2', 2)`);

  await db.query(`
      INSERT INTO user_decorations (username, decoration_id)
      VALUES ('u1', 1)
            ('u2', 2)`);
           
  await db.query(`
      INSERT INTO user_monsters (username, monster_id)
      VALUES ('u1', 1)
             ('u2', 2)`);
}


async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};