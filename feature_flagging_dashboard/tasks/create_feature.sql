-- Add your SQL queries here.
-- See SQL documentation: https://docs.airplane.dev/creating-tasks/sql
INSERT INTO
  features (
    "feature_id",
    "feature_name",
    "is_enabled",
    "updated_at"
  )
VALUES
  (
    (
      SELECT
        count("feature_id")
      FROM
        features
    ) + 1,
    :feature_name,
    :is_enabled,
    NOW()
  ) RETURNING feature_id,
  feature_name,
  is_enabled,
  updated_at;