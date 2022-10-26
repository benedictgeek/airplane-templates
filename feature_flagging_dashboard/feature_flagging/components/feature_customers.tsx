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
  useTaskMutation,
  Select,
} from "@airplane/views";
import { useState } from "react";

const FeatureCustomers = ({ selectedFeature }) => {
  const searchKeyword = useComponentState("searchKeyword");

  return (
    <Stack>
      <AddCustomerToFeature
        searchKeyword={searchKeyword}
        selectedFeature={selectedFeature}
      />
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
          rowActions={(row: any) => {
            return (
              <Button
                color="red"
                compact
                size="sm"
                task={{
                  slug: "demo_delete_feature_customer",
                  params: {
                    feature_id: selectedFeature.feature_id,
                    customer_id: row.row.customer_id,
                  },
                  refetchTasks: {
                    slug: "demo_search_feature_customers",
                    params: { search_keyword: searchKeyword.value },
                  },
                }}
              >
                Delete
              </Button>
            );
          }}
        />
      </Stack>
    </Stack>
  );
};

const AddCustomerToFeature = ({ searchKeyword, selectedFeature }) => {
  const [toggleCreateButton, setToggleButton] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);

  return (
    <>
      {toggleCreateButton ? (
        <Button onClick={() => setToggleButton(false)} sx={{ width: "180px" }}>
          Add new customer
        </Button>
      ) : (
        <Card key={selectedFeature?.feature_id + "add_customer"}>
          <Stack width="1/2">
            <Title order={5}>Add customer to feature</Title>
            <Select
              id="selectCustomer"
              task="demo_customers_list"
              outputTransform={(v) =>
                v.Q1.map(
                  (customer) =>
                    customer.customer_id + " - " + customer.contact_name
                )
              }
              placeholder="Select a customer"
              onChange={(value) =>
                setCustomerId(value?.toString().split(" - ")[0] || "")
              }
            />

            <Button
              sx={{ width: "150px" }}
              disabled={customerId == null}
              task={{
                slug: "demo_create_feature_customer",
                params: {
                  feature_id: selectedFeature?.feature_id,
                  customer_id: customerId,
                },
                refetchTasks: {
                  slug: "demo_search_feature_customers",
                  params: { search_keyword: searchKeyword.value },
                },
                onSuccess: () => {
                  setToggleButton(true);
                  showNotification({
                    message: "Added customer to feature!",
                    type: "success",
                  });
                },
              }}
            >
              Add customer
            </Button>
          </Stack>
        </Card>
      )}
    </>
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
