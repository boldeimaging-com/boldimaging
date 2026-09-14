-- Submissions from /contact/ and /ftp/.
--
-- The point of this table is that the email is the NOTIFICATION and this is
-- the RECORD. Before it existed, a Resend outage -- or simply an unset API key
-- -- meant a submission was read off the wire and dropped, with nobody aware a
-- customer had ever written in. Every handler now writes the row first and
-- sends second, so a delivery failure costs a notification, never the enquiry.
--
-- Timestamps are stored as ISO-8601 UTC strings via strftime rather than
-- datetime('now'): SQLite's default has no timezone marker and no
-- milliseconds, which makes it ambiguous the moment anything outside D1 reads
-- it. Applied with:  npm run db:migrate  (see package.json)

CREATE TABLE IF NOT EXISTS contact_submissions (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

  name             TEXT    NOT NULL,
  last_name        TEXT,
  email            TEXT,
  website          TEXT,
  message          TEXT,

  -- The form accepts an attachment but the handler only reports its name and
  -- size; the bytes are not persisted anywhere, so these two columns are the
  -- whole record of it.
  attachment_name  TEXT,
  attachment_bytes INTEGER,

  -- 'pending' the instant the row is written, then 'sent' or 'failed'. A row
  -- left at 'pending' means the handler died between insert and send, which is
  -- a different fault from 'failed' and worth being able to tell apart.
  delivery_status  TEXT    NOT NULL DEFAULT 'pending'
                   CHECK (delivery_status IN ('pending', 'sent', 'failed', 'unconfigured')),
  delivery_error   TEXT,
  resend_id        TEXT,

  -- Coarse request context for spam triage. Deliberately NOT the IP address:
  -- it is personal data under PIPEDA, it is not needed to answer an enquiry,
  -- and country plus user agent separates bot floods from real people well
  -- enough. Add the IP only if rate limiting actually needs it.
  country          TEXT,
  user_agent       TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_created  ON contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status   ON contact_submissions (delivery_status)
  WHERE delivery_status <> 'sent';

-- One row per upload batch on /ftp/. The files themselves live in R2; this
-- records who sent what, to which rep, and where the objects landed.
CREATE TABLE IF NOT EXISTS ftp_uploads (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

  full_name        TEXT    NOT NULL,
  email            TEXT    NOT NULL,
  task             TEXT    NOT NULL,
  rep              TEXT    NOT NULL,
  message          TEXT,

  -- Declared counts, written before the R2 puts are attempted. Comparing these
  -- against the rows actually in ftp_upload_files is how a partial upload is
  -- detected after the fact.
  file_count       INTEGER NOT NULL,
  total_bytes      INTEGER NOT NULL,
  r2_prefix        TEXT    NOT NULL,

  -- 'receiving' until every file is stored; then the send is attempted.
  -- 'stored' means the files are safe in R2 but the rep was never told, which
  -- is recoverable and needs to be visibly different from a clean 'sent'.
  upload_status    TEXT    NOT NULL DEFAULT 'receiving'
                   CHECK (upload_status IN ('receiving', 'stored', 'failed')),
  upload_error     TEXT,

  delivery_status  TEXT    NOT NULL DEFAULT 'pending'
                   CHECK (delivery_status IN ('pending', 'sent', 'failed', 'unconfigured')),
  delivery_error   TEXT,
  resend_id        TEXT,

  country          TEXT,
  user_agent       TEXT
);

CREATE INDEX IF NOT EXISTS idx_ftp_created ON ftp_uploads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ftp_rep     ON ftp_uploads (rep, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ftp_open    ON ftp_uploads (upload_status, delivery_status)
  WHERE upload_status <> 'stored' OR delivery_status <> 'sent';

-- One row per file, written as each object lands in R2. Rows exist only for
-- files that actually stored, so a batch that failed halfway leaves a truthful
-- partial list rather than a claim about files that are not there.
CREATE TABLE IF NOT EXISTS ftp_upload_files (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  upload_id     INTEGER NOT NULL REFERENCES ftp_uploads (id) ON DELETE CASCADE,
  object_key    TEXT    NOT NULL,
  original_name TEXT    NOT NULL,
  bytes         INTEGER NOT NULL,
  content_type  TEXT
);

CREATE INDEX IF NOT EXISTS idx_ftp_files_upload ON ftp_upload_files (upload_id);
