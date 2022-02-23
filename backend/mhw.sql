\echo 'Delete and recreate mhw db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mhw;
CREATE DATABASE mhw;
\c mhw

\i mhw-schema.sql

INSERT INTO users (username, password, email, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'user@gmail.com',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'admin@gmail.com',
        TRUE);

INSERT INTO slots (level, img)
VALUES 
(1, 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/gem_level_1.png'), 
(2, 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/gem_level_2.png'),
(3, 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/gem_level_3.png'),
(4, 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/decoration_level_4_mhw_wiki.png');

INSERT INTO elements (element, img)
VALUES 
('fire', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-fire-damage.png'),
('water', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-water-elemental-damage.png'),
('ice', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-ice-damage.png'),
('thunder', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-thunder-damage.png'),
('dragon', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-dragon-damage.png'),
('blast', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/Blastblight.png'),
('poison', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-poison-status-effect.png'),
('sleep', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/sleep-mhw-status-effect.png'),
('paralysis', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/paralysis-icon.png'),
('stun', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-stun-status-effect.png');

INSERT INTO weapon_types (type, img)
VALUES 
('great-sword', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_01.png'),
('long-sword', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_02.png'),
('sword-and-shield', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_03.png'),
('dual-blades', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_04.png'),
('hammer', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_05.png'),
('hunting-horn', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_06.png'),
('lance', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_07.png'),
('gunlance', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_08.png'),
('switch-axe', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_09.png'),
('charge-blade', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_10.png'),
('insect-glaive', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_11.png'),
('light-bowgun', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_13.png'),
('heavy-bowgun', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_14.png'),
('bow', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_12.png');

DROP DATABASE mhw_test;
CREATE DATABASE mhw_test;
\c mhw_test

\i mhw-schema.sql

INSERT INTO users (username, password, email, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'user@gmail.com',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'admin@gmail.com',
        TRUE);

INSERT INTO slots (level, img)
VALUES 
(1, 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/gem_level_1.png'), 
(2, 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/gem_level_2.png'),
(3, 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/gem_level_3.png'),
(4, 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/decoration_level_4_mhw_wiki.png');

INSERT INTO elements (element, img)
VALUES 
('fire', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-fire-damage.png'),
('water', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-water-elemental-damage.png'),
('ice', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-ice-damage.png'),
('thunder', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-thunder-damage.png'),
('dragon', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-dragon-damage.png'),
('blast', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/Blastblight.png'),
('poison', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-poison-status-effect.png'),
('sleep', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/sleep-mhw-status-effect.png'),
('paralysis', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/paralysis-icon.png'),
('stun', 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/mhw-stun-status-effect.png');

INSERT INTO weapon_types (type, img)
VALUES 
('great-sword', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_01.png'),
('long-sword', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_02.png'),
('sword-and-shield', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_03.png'),
('dual-blades', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_04.png'),
('hammer', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_05.png'),
('hunting-horn', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_06.png'),
('lance', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_07.png'),
('gunlance', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_08.png'),
('switch-axe', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_09.png'),
('charge-blade', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_10.png'),
('insect-glaive', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_11.png'),
('light-bowgun', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_13.png'),
('heavy-bowgun', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_14.png'),
('bow', 'https://www.monsterhunterworld.com/pc/topics/boost/images/icon_weapon_12.png');