-- Add your SQL queries here.
-- See SQL documentation: https://docs.airplane.dev/creating-tasks/sql
-- delete features customers
DELETE FROM
  features_customers
WHERE
  feature_id = :feature_id;

DELETE FROM
  features
WHERE
  feature_id = :feature_id;