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
  element TEXT PRIMARY KEY
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
  skill_id INTEGER REFERENCES skills INITIALLY DEFERRED,
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
  set_bonus INTEGER REFERENCES set_bonuses INITIALLY DEFERRED
);

-- by pieces
CREATE TABLE set_skills (
  id SERIAL PRIMARY KEY,
  armor_set_id INTEGER REFERENCES armor_sets INITIALLY DEFERRED,
  set_bonus_id INTEGER REFERENCES set_bonuses INITIALLY DEFERRED,
  skill_level_id INTEGER REFERENCES skill_levels INITIALLY DEFERRED,
  pieces INTEGER,
  description TEXT
);

CREATE TABLE armor (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rank TEXT NOT NULL,
  slots JSON,
  rarity INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  armor_set_id INTEGER references armor_sets INITIALLY DEFERRED,
  m_img TEXT, 
  f_img TEXT
);

CREATE TABLE armor_skills (
  id SERIAL PRIMARY KEY,
  armor_id INTEGER REFERENCES armor INITIALLY DEFERRED,
  skill_level_id INTEGER REFERENCES skill_levels INITIALLY DEFERRED
);

CREATE TABLE armor_materials (
  id SERIAL PRIMARY KEY,
  armor_id INTEGER REFERENCES armor INITIALLY DEFERRED,
  item_id INTEGER REFERENCES items INITIALLY DEFERRED,
  quantity INTEGER NOT NULL
);

CREATE TABLE monsters (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  species TEXT,
  description TEXT
);

CREATE TABLE monster_locations (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters INITIALLY DEFERRED,
  location_id INTEGER REFERENCES locations INITIALLY DEFERRED
);

CREATE TABLE monster_weaknesses (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters INITIALLY DEFERRED,
  element TEXT REFERENCES elements,
  stars INTEGER NOT NULL,
  condition TEXT
);

CREATE TABLE monster_resistances (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters INITIALLY DEFERRED,
  element TEXT REFERENCES elements,
  condition TEXT
);

CREATE TABLE monster_ailments (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters INITIALLY DEFERRED,
  ailment_id INTEGER REFERENCES ailments INITIALLY DEFERRED
);

CREATE TABLE monster_rewards (
  id INTEGER PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters INITIALLY DEFERRED,
  item_id INTEGER REFERENCES items INITIALLY DEFERRED,
  conditions JSON ARRAY
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
  charm_id INTEGER REFERENCES charms INITIALLY DEFERRED,
  skill_level_id INTEGER REFERENCES skill_levels INITIALLY DEFERRED
);

CREATE TABLE charm_materials (
  id SERIAL PRIMARY KEY,
  charm_id INTEGER REFERENCES charms INITIALLY DEFERRED,
  item_id INTEGER REFERENCES items INITIALLY DEFERRED,
  quantity INTEGER
);

CREATE TABLE decorations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  rarity INTEGER NOT NULL,
  slot INTEGER NOT NULL
);

CREATE TABLE decoration_skills (
  id SERIAL PRIMARY KEY,
  decoration_id INTEGER REFERENCES decorations INITIALLY DEFERRED,
  skill_level_id INTEGER REFERENCES skill_levels INITIALLY DEFERRED
);

CREATE TABLE weapons (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  attack INTEGER NOT NULL,
  damage_type TEXT,
  slots JSON,
  attributes JSON,
  rarity INTEGER NOT NULL,
  elderseal TEXT,
  craftable BOOLEAN,
  -- white sharpness per handicraft level
  white_sharpness INTEGER[],
  coatings TEXT[],
  phial JSON,
  shelling JSON,
  ammo BOOLEAN,
  special_ammo TEXT,
  img TEXT
);

CREATE TABLE weapon_ammo (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED,
  type TEXT,
  capacities INTEGER[]
);

CREATE TABLE weapon_elements (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED,
  element TEXT REFERENCES elements INITIALLY DEFERRED,
  damage INTEGER NOT NULL,
  hidden BOOLEAN
);

CREATE TABLE weapon_materials (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED,
  item_id INTEGER REFERENCES items INITIALLY DEFERRED,
  craft_or_upgrade TEXT NOT NULL,
  quantity INTEGER NOT NULL
);


-- USERS --------------
CREATE TABLE user_armor (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users,
  armor_id INTEGER REFERENCES armor,
  slot1 INTEGER REFERENCES decorations,
  slot2 INTEGER REFERENCES decorations,
  slot3 INTEGER REFERENCES decorations,
  slot1_in BOOLEAN,
  slot2_in BOOLEAN,
  slot3_in BOOLEAN
);

CREATE TABLE user_monsters (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users, 
  monster_id INTEGER REFERENCES monsters
);