-- Add your SQL queries here.
-- See SQL documentation: https://docs.airplane.dev/creating-tasks/sql
-- INSERT INTO
--   features_customers ("feature_id", "customer_id")
-- VALUES
--   (:feature_id, :customer_id) RETURNING feature_id,
--   customer_id;
INSERT INTO
  features_customers ("feature_id", "customer_id")
SELECT
  *
FROM
  (
    SELECT
      :feature_id::integer AS feature_id,
      :customer_id AS customer_id
  ) AS temp
WHERE
  NOT EXISTS (
    SELECT
      customer_id
    FROM
      features_customers
    WHERE
      customer_id = :customer_id
      AND feature_id = :feature_id
  )
LIMIT
  1;