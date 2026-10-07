-- What the client edits at /admin/: the "Your Rep" list on /ftp/ and the
-- addresses /contact/ enquiries are sent to. Both used to be code -- the reps
-- hardcoded in two files, the recipients a Railway variable -- so changing
-- either needed a developer.
--
-- The seeds below match what was hardcoded. src/lib/settings.ts keeps the same
-- list as a fallback, so the forms keep working if Postgres is unreachable.

CREATE TABLE IF NOT EXISTS ftp_reps (
  id         BIGINT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT    NOT NULL,
  -- Stored lowercase. It is what the /ftp/ select posts and what
  -- ftp_uploads.rep records, so removing a rep leaves past uploads readable.
  email      TEXT    NOT NULL UNIQUE,
  -- Explicit, for the same reason as gallery_items.position: the dropdown
  -- order is the client's choice, not insertion order.
  position   INTEGER NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO ftp_reps (name, email, position) VALUES
  ('Joe Husami',     'joe@boldeimaging.com',     1),
  ('Tony Roy',       'tony.r@boldeimaging.com',  2),
  ('Ed Pawluk',      'ed@boldeimaging.com',      3),
  ('Mo Husami',      'mo@boldeimaging.com',      4),
  ('Dan Lethbridge', 'dan@boldeimaging.com',     5),
  ('Jarrod Hickey',  'jarrod@boldeimaging.com',  6),
  ('Suzy Costa',     'suzy@boldeimaging.com',    7)
ON CONFLICT (email) DO NOTHING;

-- Single values the client can change. Only 'contact_recipients' (a JSON array
-- of addresses) exists today. It is deliberately NOT seeded: with no row the
-- CONTACT_TO variable still applies, so the first deploy changes nothing until
-- someone saves the list in /admin/.
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
