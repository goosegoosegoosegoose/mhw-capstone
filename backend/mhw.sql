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

INSERT INTO slots (level)
VALUES (1), (2), (3), (4);

DROP DATABASE mhw_test;
CREATE DATABASE mhw_test;
\c mhw_test

\i mhw-schema.sql
