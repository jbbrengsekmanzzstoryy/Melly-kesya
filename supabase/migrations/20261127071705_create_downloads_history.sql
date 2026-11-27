/*
# Create downloads history table

1. New Tables
- `downloads`
  - `id` (uuid, primary key)
  - `title` (text, not null) - name of the downloaded media
  - `platform` (text, not null) - source platform (TikTok, YouTube, Instagram, Facebook, Twitter, Spotify, Apple Music, CapCut)
  - `format` (text, not null) - file format (MP4, MP3)
  - `quality` (text, not null) - resolution or bitrate (e.g. 720p, 128kbps)
  - `source_url` (text, not null) - original link the user pasted
  - `download_url` (text, nullable) - direct media link returned by the API
  - `thumbnail` (text, nullable) - thumbnail image URL
  - `duration` (text, nullable) - media duration label
  - `status` (text, not null, default 'Selesai') - download status
  - `created_at` (timestamp)

2. Security
- Enable RLS on `downloads`.
- Grant SELECT, INSERT, DELETE to `anon` + `authenticated` (single-tenant app, no sign-in; data is intentionally shared on this device's session).
- Policies: anon + authenticated can select, insert and delete rows (history is shared, no user accounts).

3. Notes
- Single-tenant schema: the user did not ask for accounts, so no user_id column.
- History rows persist download activity so it survives page reloads.
*/

CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  platform text NOT NULL,
  format text NOT NULL,
  quality text NOT NULL,
  source_url text NOT NULL,
  download_url text,
  thumbnail text,
  duration text,
  status text NOT NULL DEFAULT 'Selesai',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON downloads TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_downloads" ON downloads;
CREATE POLICY "anon_select_downloads" ON downloads
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_downloads" ON downloads;
CREATE POLICY "anon_insert_downloads" ON downloads
FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_downloads" ON downloads;
CREATE POLICY "anon_delete_downloads" ON downloads
FOR DELETE TO anon, authenticated USING (true);
