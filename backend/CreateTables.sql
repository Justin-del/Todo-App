.read better-auth_migrations/2026-09-06T16-32-30.514Z.sql

-- This table definition is based on SystemRequirements.md (DR-TD-01 and DR-TD-02)
-- As the description can be optional, description can be an empty string.
create table if not exists todo (id TEXT NOT NULL PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, is_completed INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ')), updated_at TEXT, user_id TEXT NOT NULL, FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE);