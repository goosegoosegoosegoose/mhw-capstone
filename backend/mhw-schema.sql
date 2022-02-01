CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE slots (
  level INTEGER PRIMARY KEY
);

CREATE TABLE elements (
  name TEXT PRIMARY KEY
);

CREATE TABLE locations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  zone_count INTEGER NOT NULL,
  camps JSON
);

CREATE TABLE items (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  rarity INTEGER NOT NULL,
  carry_limit INTEGER,
  value INTEGER
);

CREATE TABLE skills (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE skill_levels (
  id INTEGER PRIMARY KEY,
  skill_id INTEGER REFERENCES skills,
  level INTEGER NOT NULL,
  modifiers JSON,
  description TEXT
);

CREATE TABLE ailments (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE set_bonuses (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE armor_sets (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  rank TEXT NOT NULL,
  set_bonus INTEGER REFERENCES set_bonuses
);

-- by pieces
CREATE TABLE set_skills (
  id SERIAL PRIMARY KEY,
  armor_set_id INTEGER REFERENCES armor_sets,
  set_bonus_id INTEGER REFERENCES set_bonuses,
  skill_level_id INTEGER REFERENCES skill_levels,
  pieces INTEGER,
  description TEXT
);

CREATE TABLE armor (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rank TEXT NOT NULL,
  rarity INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  armor_set_id INTEGER references armor_sets,
  m_img TEXT, 
  f_img TEXT
  -- TODO ADD CRAFTING (maybe not? many to many probably yeah yes)
);

CREATE TABLE armor_skills (
  id SERIAL PRIMARY KEY,
  armor_id INTEGER REFERENCES armor,
  skill_level_id INTEGER REFERENCES skill_levels
);

CREATE TABLE armor_materials (
  id SERIAL PRIMARY KEY,
  armor_id INTEGER REFERENCES armor,
  item_id INTEGER REFERENCES items,
  quantity INTEGER NOT NULL
);

CREATE TABLE monsters (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  species TEXT,
  description TEXT
);

CREATE TABLE monsters_locations (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters,
  location_id INTEGER REFERENCES locations
);

-- TODO m2m weakness(element) monsters
CREATE TABLE monster_weaknesses (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters,
  element TEXT REFERENCES elements,
  stars INTEGER NOT NULL,
  condition TEXT
);
-- m2m resistances, m2m ailments, m2m rewards. nice cool nice i can do that yeah
CREATE TABLE monster_resistances (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters,
  element TEXT REFERENCES elements,
  condition TEXT
);

CREATE TABLE monster_ailments (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters,
  ailment_id TEXT REFERENCES ailments
);

CREATE TABLE monster_rewards (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters,
  item_id INTEGER REFERENCES items
);

CREATE TABLE monster_reward_conditions (
  id SERIAL PRIMARY KEY,
  monster_reward_id INTEGER REFERENCES monster_rewards,
  from TEXT NOT NULL,
  subfrom TEXT,
  rank TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  chance INTEGER NOT NULL
);

CREATE TABLE charms (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  rarity INTEGER NOT NULL,
  craftable BOOLEAN
);

CREATE TABLE charm_skills (
  id SERIAL PRIMARY KEY,
  charm_id INTEGER REFERENCES charms,
  skill_level_id INTEGER REFERENCES skill_levels
);

CREATE TABLE charm_materials (
  id SERIAL PRIMARY KEY,
  charm_id INTEGER REFERENCES charms,
  item_id INTEGER REFERENCES items,
  quantity INTEGER
);

CREATE TABLE decorations (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  rarity INTEGER NOT NULL,
  skill_id INTEGER REFERENCES skills
);

-- weaposn mnot done
CREATE TABLE weapons (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  attack INTEGER NOT NULL,
  damage_type TEXT NOT NULL,
  attributes JSON
  rarity INTEGER NOT NULL,
  elderseal TEXT,
  craftable BOOLEAN,
  sharpness JSON,
  coatings JSON,
  phial JSON,
  shelling JSON,
  ammo JSON,
  img TEXT
);
-- TODO m2m element weapons 
-- TODO crafting wepo (craft or upgrade based on boolean)

-- TODO m2m ailments weapons/monsters probably maybe?
-- TODO m2m monsters rewards(items) with conditions
-- TODO m2m with ARMOR and SLOTS with what its filled with
-- decos should reference slots 

-- CREATE TABLE armor_resistances (
--   id SERIAL PRIMARY KEY,
--   armor_id INTEGER REFERENCES armor,
--   element TEXT,
--   value INTEGER
-- );

-- USERS
CREATE TABLE user_armor (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users,
  armor_id INTEGER REFERENCES armor
);

CREATE TABLE user_monsters (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users, 
  monster_id INTEGER REFERENCES monsters
);