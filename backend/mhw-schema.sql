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
  level INTEGER,
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

CREATE TABLE armors (
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

CREATE TABLE monsters (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  species TEXT,
  description TEXT
);

CREATE TABLE charms (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER,
  rarity INTEGER,
  craftable BOOLEAN
);

CREATE TABLE charm_skills (
  id SERIAL PRIMARY KEY,
  charm_id INTEGER REFERENCES charms,
  skill_level_id INTEGER REFERENCES skill_levels,
  level INTEGER
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

-- weaposn

-- CREATE TABLE ailments_items (
--   id SERIAL PRIMARY KEY,
--   ailment_id INTEGER REFERENCES ailments,
--   item_id INTEGER REFERENCES items
-- );

-- TODO m2m element weapons
-- TODO m2m resistance(element) armors and monsters
-- TODO m2m weakness(element) monsters
-- TODO m2m locations monsters
-- TODO m2m ailments weapons/monsters probably maybe?
-- TODO m2m monsters rewards(items) with conditions
-- TODO m2m with ARMOR and SLOTS with what its filled with
-- decos should reference slots 

-- TODO two m2ms between ailments and items (revoery /protection )
-- wwait maybe four m2ms because skills god dangit

-- CREATE TABLE armor_resistances (
--   id SERIAL PRIMARY KEY,
--   armor_id INTEGER REFERENCES armors,
--   element TEXT,
--   value INTEGER
-- );

-- USERS
CREATE TABLE user_armors (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users,
  armor_id INTEGER REFERENCES armors
);

CREATE TABLE user_monsters (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users, 
  monster_id INTEGER REFERENCES monsters
);