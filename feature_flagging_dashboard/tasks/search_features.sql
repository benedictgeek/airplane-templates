-- Add your SQL queries here.
-- See SQL documentation: https://docs.airplane.dev/creating-tasks/sql
SELECT
  feature_id,
  feature_name,
  is_enabled,
  updated_at
FROM
  features
WHERE
  feature_name ILIKE CONCAT('%', cast(:keyword AS varchar), '%')
ORDER BY
  feature_id;