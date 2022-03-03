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
    VALUES (1, 'L1', 1, $1, 'http://L1.icon', $2),
           (2, 'L2', 2, $3, 'http://L2.icon', $4),
           (3, 'L3', 3, $5, 'http://L3.icon', $6)`,
    [
      {name:'camp1'},
      ['http://L1.img'],
      {name:'camp2'},
      ['http://L2.img'],
      {name:'camp3'},
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

  await db.query(`
    INSERT INTO ailments (id, name, description)
    VALUES (1, 'a1', 'testa1'),
           (2, 'a2', 'testa2')`);

  await db.query(`
    INSERT INTO armor_sets (id, name, rank, set_bonus)
    VALUES (1, 'as1', 'testrank1', 'testbonusas1'),
           (2, 'as2', 'testrank2', 'testbonusas2')`);

  await db.query(`
    INSERT INTO set_skills (armor_set_id, skill_id, pieces)
    VALUES (1, 1, 1),
           (2, 2, 2)`);

  await db.query(`
    INSERT INTO armor (id, name, type, rank, slots, rarity, defense_base, defense_max, defense_augmented, armor_set_id, m_img, f_img)
    VALUES (1, 'a1', 'head', 'testranka1', $1, 1, 1, 1, 1, 1, 'testa1m', 'testa1f'),
           (2, 'a2', 'chest', 'testranka2', $2, 2, 2, 2, 2, 1, 'testa2m', 'testa2f'),
           (3, 'a3', 'gloves', 'testranka3', $3, 3, 3, 3, 3, 1, 'testa3m', 'testa3f'),
           (4, 'a4', 'waist', 'testranka4', $4, 4, 4, 4, 4, 1, 'testa4m', 'testa4f'),
           (5, 'a5', 'legs', 'testranka5', $5, 5, 5, 5, 5, 1, 'testa5m', 'testa5f'),
           (7, 'a7', 'chest', 'testranka7', $6, 7, 7, 7, 7, 2, 'testa7m', 'testa7f')`,
    [{1:1, 2:1, 3:1, 4:1}, {1:1, 2:1, 3:1, 4:1}, {1:1, 2:1, 3:1, 4:1}, {1:1, 2:1, 3:1, 4:1}, {1:1, 2:1, 3:1, 4:1}, {1:1, 2:1, 3:1, 4:1}]);

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
      VALUES (1, 'testtypec1', 'testrank1', 1, 10, 'test'),
             (2, 'testtypec2', 'testrank2', 2, 20, $1)`, [null]);

  await db.query(`
      INSERT INTO charms (id, name, level, rarity)
      VALUES (1, 'c1', 1, 1),
             (2, 'c2', 2, 2)`);

  await db.query(`
      INSERT INTO charm_skills (charm_id, skill_id)
      VALUES (1, 1),
             (2, 2)`);
             
  await db.query(`
      INSERT INTO charm_materials (charm_id, item_id, quantity)
      VALUES (1, 1, 1),
             (2, 2, 2)`);
             
  await db.query(`
      INSERT INTO decorations (id, name, rarity, slot)
      VALUES (1, 'd1', 1, 1),
             (2, 'd2', 2, 2)`);

  await db.query(`
      INSERT INTO decoration_skills (decoration_id, skill_id)
      VALUES (1, 1),
             (2, 2)`);

  await db.query(`
      INSERT INTO weapon_types (type, img)
      VALUES ('great-sword', 'http://t1.img'),
             ('bow', 'http://t2.img'),
             ('switch-axe', 'http://t3.img'),
             ('gunlance', 'http://t4.img'),
             ('insect-glaive', 'http://t5.img'),
             ('light-bowgun', 'http://t6.img')`);      

  await db.query(`
      INSERT INTO weapons (id, name, type, attack, affinity, defense, damage_type, slots, rarity, elderseal, img)
      VALUES (1, 'w1', 'great-sword', 1, 1, 1, 'testdmg1', $1, 1, 'testseal1', 'http://w1.img'),
             (2, 'w2', 'bow', 2, 2, 2, 'testdmg2', $2, 2, 'testseal2', 'http://w2.img'),
             (3, 'w3', 'switch-axe', 3, 3, 3, 'testdmg3', $3, 3, 'testseal3', 'http://w3.img'),
             (4, 'w4', 'gunlance', 4, 4, 4, 'testdmg4', $4, 4, 'testseal4', 'http://w4.img'),
             (5, 'w5', 'insect-glaive', 5, 5, 5, 'testdmg5', $5, 5, 'testseal5', 'http://w5.img'),
             (6, 'w6', 'light-bowgun', 6, 6, 6, 'testdmg6', $6, 6, 'testseal6', 'http://w6.img'),
             (7, 'w7', 'great-sword', 7, 7, 7, 'testdmg7', $7, 7, 'testseal7', 'http://w7.img')`,
      [{1:1}, {1:1}, {1:1}, {1:1}, {1:1}, {1:1}, {1:1}]);

  await db.query(`
      INSERT INTO weapon_sharpness (weapon_id, white_sharpness)
      VALUES (1, $1),
             (3, $2),
             (4, $3),
             (5, $4),
             (7, $5)`,
      [[1], [1], [1], [1], [1]]);

  await db.query(`
      INSERT INTO weapon_coatings (weapon_id, coatings)
      VALUES (2, $1)`,
      [["test1"]]);

  await db.query(`
      INSERT INTO weapon_phials (weapon_id, phial_type, phial_damage)
      VALUES (3, 'testphial1', 1)`);

  await db.query(`
      INSERT INTO weapon_shelling (weapon_id, shelling_type, shelling_level)
      VALUES (4, 'testshell1', 1)`);

  await db.query(`
      INSERT INTO weapon_boosts (weapon_id, boost_type)
      VALUES (5, 'testboost1')`);             

  await db.query(`
      INSERT INTO weapon_gunspecs (weapon_id, special_ammo, deviation)
      VALUES (6, 'testspecialammo1', 'testdeviation1')`);             
                
  await db.query(`
      INSERT INTO weapon_ammo (weapon_id, ammo_type, capacities)
      VALUES (6, 'testammo1', $1)`,
      [[1]]);
  
  await db.query(`
      INSERT INTO weapon_elements (weapon_id, element, damage, hidden)
      VALUES (1, 'fire', 1, true),
             (2, 'water', 2, false)`);

  await db.query(`
      INSERT INTO weapon_materials (weapon_id, item_id, craft_or_upgrade, quantity)
      VALUES (1, 1, 'craft', 1),
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
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR)
  ]);

  await db.query(`
      INSERT INTO user_armor (username, armor_id, slots)
      VALUES ('u1', 1, $1),
             ('u1', 2, $2),
             ('u1', 3, $3),
             ('u1', 4, $4)`,
    [{1:1, 2:1, 3:1, 4:1}, {1:1, 2:1, 3:1, 4:1}, {1:1, 2:1, 3:1, 4:1}, {1:1, 2:1, 3:1, 4:1}]);

  await db.query(`
      INSERT INTO user_weapons (username, weapon_id, slots)
      VALUES ('u1', 1, $1)`,
    [{1:1}]);

  await db.query(`
      INSERT INTO user_charms (username, charm_id)
      VALUES ('u1', 1)`);

  await db.query(`
      INSERT INTO user_decorations (username, decoration_id)
      VALUES ('u1', 1)`);
           
  await db.query(`
      INSERT INTO user_monsters (username, monster_id)
      VALUES ('u1', 1)`);
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