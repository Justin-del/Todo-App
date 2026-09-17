.read better-auth_migrations/2026-09-06T16-32-30.514Z.sql

-- This table definition is based on SystemRequirements.md (DR-TD-01 and DR-TD-02)
-- As the description can be optional, description can be an empty string.
create table if not exists todo (id TEXT NOT NULL PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, is_completed INTEGER NOT NULL CHECK(is_completed IN (0,1)), created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ')), updated_at TEXT, user_id TEXT NOT NULL, FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE);


CREATE TRIGGER IF NOT EXISTS update_todo_updated_at
AFTER UPDATE ON todo
WHEN 
  -- Only execute if one of the editable data fields actually changed
  (NEW.title IS NOT OLD.title) OR
  (NEW.description IS NOT OLD.description) OR
  (NEW.is_completed IS NOT OLD.is_completed)
BEGIN
  UPDATE todo 
  SET updated_at = strftime('%Y-%m-%dT%H:%M:%SZ')
  WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS prevent_todo_immutable_fields_from_being_updated_once_set
BEFORE UPDATE ON todo
WHEN
  ((NEW.id IS NOT OLD.id) AND (OLD.id is NOT NULL)) OR
  ((NEW.created_at IS NOT OLD.created_at) AND (OLD.created_at IS NOT NULL)) OR
  ((NEW.user_id IS NOT OLD.user_id) AND (old.user_id IS NOT NULL))
BEGIN
  SELECT RAISE(ABORT,'id, created_at, and user_id of the todo table are immutable once their values are set.');
END;