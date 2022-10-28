SELECT
  fc.feature_id,
  c.customer_id,
  c.contact_name,
  c.address,
  c.country
FROM
  features_customers AS fc
  INNER JOIN customers AS c ON fc.customer_id = c.customer_id
WHERE
  feature_id = :feature_id
  AND (
    c.contact_name ILIKE CONCAT('%', cast(:keyword AS varchar), '%')
    OR c.address ILIKE CONCAT('%', cast(:keyword AS varchar), '%')
    OR c.country ILIKE CONCAT('%', cast(:keyword AS varchar), '%')
  )
ORDER BY
  feature_id;