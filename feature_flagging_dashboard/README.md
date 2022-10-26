# Template: Feature Flagging Dashboard

## Next steps

- Navigate to the feature_flagging_dashboard directory: `cd feature_flagging_dashboard`
- If you plan on using this on a different database resource than the demo database, change the `[Demo DB]` resource in `create_feature_customer.task.yaml`, `create_feature.task.yaml`, `customers_list.task.yaml`, `delete_feature_customer.task.yaml`, `delete_feature.task.yaml`, `edit_feature.task.yaml`, `search_feature_customers.task.yaml` and `search_features.task.yaml` to the name of your own database resource
- Deploy tasks: `airplane deploy tasks --yes`
- Develop your template locally: `airplane views dev`
- Deploy your view: `airplane deploy .`
- Visit the docs to learn more about how to build views: https://docs.airplane.dev/views/getting-started
