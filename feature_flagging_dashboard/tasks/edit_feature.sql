-- Add your SQL queries here.
-- See SQL documentation: https://docs.airplane.dev/creating-tasks/sql
UPDATE
  features
SET
  feature_name = :feature_name,
  is_enabled = :is_enabled,
  updated_at = NOW()
WHERE
  feature_id = :feature_id;