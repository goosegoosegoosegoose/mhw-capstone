CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- CREATE TABLE ailments (
--   id INTEGER PRIMARY KEY,
--   name TEXT UNIQUE NOT NULL,
--   description TEXT NOT NULL
-- );

CREATE TABLE armor_sets (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users, 
  armor_set_id INTEGER
);

CREATE TABLE armors (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users,
  armor_id INTEGER
);

-- CREATE TABLE charms (
--   id INTEGER PRIMARY KEY,
--   slug TEXT NOT NULL,
--   name TEXT NOT NULL,
--   ranks JSON
-- );

-- CREATE TABLE decorations (
--   id INTEGER PRIMARY KEY,
--   slug TEXT NOT NULL,
--   name TEXT NOT NULL,
--   rarity INTEGER NOT NULL,
--   skill_id INTEGER REFERENCES skills
-- )

-- CREATE TABLE items (
--   id INTEGER PRIMARY KEY,
--   name TEXT UNIQUE NOT NULL,
--   description TEXT,
--   rarity INTEGER NOT NULL,
--   carry_limit INTEGER,
--   zenny_value INTEGER
-- );

-- CREATE TABLE locations (
--   id INTEGER PRIMARY KEY,
--   name TEXT UNIQUE NOT NULL,
--   zone_count INTEGER NOT NULL,
--   camps JSON
-- );

CREATE TABLE monsters (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users, 
  monster_id INTEGER
);





-- CREATE TABLE ailments_items (
--   id SERIAL PRIMARY KEY,
--   ailment_id INTEGER REFERENCES ailments,
--   item_id INTEGER REFERENCES items
-- );