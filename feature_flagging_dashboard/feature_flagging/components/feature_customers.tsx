import {
  Button,
  Checkbox,
  Stack,
  Table,
  Text,
  Title,
  TextInput,
  Card,
  useComponentState,
  Divider,
  Form,
  showNotification,
  useTaskMutation
} from "@airplane/views";

const FeatureCustomers = ({ selectedFeature }) => {
  const searchKeyword = useComponentState("searchKeyword");

  return (
    <Stack>
      <Stack direction="row" align="center" grow>
        <Table
          id="featureCustomers"
          title="Feature customers"
          columns={featureCustomersCols}
          defaultPageSize={5}
          task={{
            slug: "demo_search_feature_customers",
            params: {
              search_keyword: searchKeyword.value,
              feature_id: selectedFeature.feature_id,
            },
          }}
          rowSelection="single"
          showFilter={true}
          hiddenColumns={["feature_id"]}
          rowActions={(row) => {
            return (
              <Button color="red" compact size="sm">
                Delete
              </Button>
            );
          }}
        />
      </Stack>
    </Stack>
  );
};

const featureCustomersCols = [
  { accessor: "feature_id", label: "Feature ID" },
  { accessor: "customer_id", label: "Customer ID" },
  { accessor: "contact_name", label: "Contact name" },
  { accessor: "address", label: "Address" },
  { accessor: "country", label: "Country" },
];

export default FeatureCustomers;
