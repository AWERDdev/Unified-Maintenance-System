
psql -h localhost -p 7000 -U postgres

\dn

SET search_path TO private_data, public;
SET search_path TO qr_data, public;

\dt

SELECT * FROM private_data."users";
SELECT * FROM private_data."admins";

SELECT * FROM qr_data."qrcodes";

DELETE FROM private_data."admins";
DELETE FROM private_data."users";

DELETE FROM qr_data."qrcodes";

DROP TABLE IF EXISTS private_data.admins CASCADE;

DROP TABLE IF EXISTS private_data.users CASCADE;

DROP DATABASE IF EXISTS "QRGEN_DB";
