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
  level INTEGER NOT NULL,
  description TEXT
);

CREATE TABLE ailments (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE armor_sets (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  rank TEXT NOT NULL,
  set_bonus TEXT
);

-- by pieces
CREATE TABLE set_skills (
  id SERIAL PRIMARY KEY,
  armor_set_id INTEGER REFERENCES armor_sets INITIALLY DEFERRED,
  skill_id INTEGER REFERENCES skills INITIALLY DEFERRED,
  pieces INTEGER
);

CREATE TABLE armor (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rank TEXT NOT NULL,
  slots JSON,
  rarity INTEGER NOT NULL,
  defense_base INTEGER NOT NULL,
  defense_max INTEGER NOT NULL,
  defense_augmented INTEGER NOT NULL,
  armor_set_id INTEGER REFERENCES armor_sets INITIALLY DEFERRED,
  m_img TEXT, 
  f_img TEXT
);

CREATE TABLE armor_skills (
  id SERIAL PRIMARY KEY,
  armor_id INTEGER REFERENCES armor INITIALLY DEFERRED,
  skill_id INTEGER REFERENCES skills INITIALLY DEFERRED
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

CREATE TABLE monster_ailments (
  id SERIAL PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters INITIALLY DEFERRED,
  ailment_id INTEGER REFERENCES ailments INITIALLY DEFERRED
);

CREATE TABLE monster_materials (
  id INTEGER PRIMARY KEY,
  monster_id INTEGER REFERENCES monsters INITIALLY DEFERRED,
  item_id INTEGER REFERENCES items INITIALLY DEFERRED
);

CREATE TABLE monster_material_conditions (
  id SERIAL PRIMARY KEY,
  monster_material_id INTEGER REFERENCES monster_materials INITIALLY DEFERRED,
  type TEXT NOT NULL,
  rank TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  chance INTEGER NOT NULL,
  subtype TEXT
);

CREATE TABLE charms (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  rarity INTEGER NOT NULL,
  -- depreciated delete craftable
  craftable BOOLEAN
);

CREATE TABLE charm_skills (
  id SERIAL PRIMARY KEY,
  charm_id INTEGER REFERENCES charms INITIALLY DEFERRED,
  skill_id INTEGER REFERENCES skills INITIALLY DEFERRED
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
  skill_id INTEGER REFERENCES skills INITIALLY DEFERRED
);

CREATE TABLE weapons (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  attack INTEGER NOT NULL,
  affinity INTEGER,
  defense INTEGER,
  damage_type TEXT,
  slots JSON,
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
  slot1 INTEGER REFERENCES slots,
  slot2 INTEGER REFERENCES slots,
  slot3 INTEGER REFERENCES slots,
  slot1_in INTEGER REFERENCES decorations,
  slot2_in INTEGER REFERENCES decorations,
  slot3_in INTEGER REFERENCES decorations
);

CREATE TABLE user_weapons (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON UPDATE CASCADE,
  weapon_id INTEGER REFERENCES weapons,
  slot1 INTEGER REFERENCES slots,
  slot2 INTEGER REFERENCES slots,
  slot3 INTEGER REFERENCES slots,
  slot1_in INTEGER REFERENCES decorations,
  slot2_in INTEGER REFERENCES decorations,
  slot3_in INTEGER REFERENCES decorations
);

CREATE TABLE user_charms (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON UPDATE CASCADE,
  charm_id INTEGER REFERENCES charms
);

CREATE TABLE user_decorations (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON UPDATE CASCADE,
  decoration_id INTEGER REFERENCES decorations
);

CREATE TABLE user_monsters (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON UPDATE CASCADE, 
  monster_id INTEGER REFERENCES monsters
);