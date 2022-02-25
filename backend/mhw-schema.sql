CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE slots (
  level INTEGER PRIMARY KEY,
  img TEXT
);

CREATE TABLE elements (
  element TEXT PRIMARY KEY,
  img TEXT
);

CREATE TABLE locations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  zone_count INTEGER NOT NULL,
  camps JSON,
  icon TEXT,
  imgs TEXT[]
);

CREATE TABLE items (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  rarity INTEGER NOT NULL
);

CREATE TABLE skills (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  description TEXT,
  cap INTEGER
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
  description TEXT,
  icon TEXT,
  img TEXT
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
  rarity INTEGER NOT NULL
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
  slot INTEGER REFERENCES slots INITIALLY DEFERRED
);

CREATE TABLE decoration_skills (
  id SERIAL PRIMARY KEY,
  decoration_id INTEGER REFERENCES decorations INITIALLY DEFERRED,
  skill_id INTEGER REFERENCES skills INITIALLY DEFERRED
);

CREATE TABLE weapon_types (
  type TEXT PRIMARY KEY,
  img TEXT
);

CREATE TABLE weapons (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT REFERENCES weapon_types INITIALLY DEFERRED,
  attack INTEGER NOT NULL,
  affinity INTEGER,
  defense INTEGER,
  damage_type TEXT,
  slots JSON,
  rarity INTEGER NOT NULL,
  elderseal TEXT,
  img TEXT,
  icon TEXT
);

CREATE TABLE weapon_sharpness (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED,
    -- white sharpness per handicraft level
  white_sharpness INTEGER[]
);

CREATE TABLE weapon_coatings (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED,
  coatings TEXT[]
);

CREATE TABLE weapon_phials (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED,
  phial_type TEXT NOT NULL,
  phial_damage INTEGER
);

CREATE TABLE weapon_shelling (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED,
  shelling_type TEXT NOT NULL,
  shelling_level INTEGER NOT NULL
);

CREATE TABLE weapon_boosts (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED,
  boost_type TEXT
);

CREATE TABLE weapon_gunspecs (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED, 
  special_ammo TEXT,
  deviation TEXT
);

CREATE TABLE weapon_ammo (
  id SERIAL PRIMARY KEY,
  weapon_id INTEGER REFERENCES weapons INITIALLY DEFERRED,
  ammo_type TEXT NOT NULL,
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
  username TEXT REFERENCES users ON UPDATE CASCADE ON DELETE CASCADE,
  armor_id INTEGER REFERENCES armor,
  slots JSON
);

CREATE TABLE user_weapons (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON UPDATE CASCADE ON DELETE CASCADE,
  weapon_id INTEGER REFERENCES weapons,
  slots JSON
);

CREATE TABLE user_charms (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON UPDATE CASCADE ON DELETE CASCADE,
  charm_id INTEGER REFERENCES charms
);

CREATE TABLE user_decorations (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON UPDATE CASCADE ON DELETE CASCADE,
  decoration_id INTEGER REFERENCES decorations
);

CREATE TABLE user_monsters (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users ON UPDATE CASCADE ON DELETE CASCADE, 
  monster_id INTEGER REFERENCES monsters
);