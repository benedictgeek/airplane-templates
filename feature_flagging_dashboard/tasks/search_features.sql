SELECT
  feature_id,
  feature_name,
  feature_description,
  is_enabled,
  updated_at
FROM
  features
WHERE
  feature_name ILIKE CONCAT('%', cast(:keyword AS varchar), '%')
ORDER BY
  feature_id;