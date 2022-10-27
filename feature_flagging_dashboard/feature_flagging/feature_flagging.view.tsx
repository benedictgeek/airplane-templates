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
  Select,
  Dialog,
} from "@airplane/views";

import { useState } from "react";

const FeaturesDashboard = () => {
  const featuresTableState = useComponentState("features");
  const selectedFeature = featuresTableState.selectedRow;

  return (
    <Stack>
      <Title>Features dashboard</Title>
      <Text>Look up a feature and list customers subscribed to a feature</Text>
      <CreateFeature key={"createFestureCard"} />

      <Stack direction="row" align="center" grow>
        <Table
          id="features"
          title="Features"
          columns={featuresCols}
          defaultPageSize={5}
          task={{
            slug: "demo_search_features",
          }}
          hiddenColumns={["feature_id"]}
          rowSelection="single"
        />
        {selectedFeature && <EditFeature selectedFeature={selectedFeature} />}
      </Stack>
      {selectedFeature && (
        <FeatureCustomers selectedFeature={selectedFeature} />
      )}
    </Stack>
  );
};

const EditFeature = ({ selectedFeature }) => {
  const [loading, setLoading] = useState(false);
  const featureNameState = useComponentState("featureName");
  const enabledState = useComponentState("enabled");

  return (
    <Card key={selectedFeature.feature_id}>
      <Stack>
        <Title order={4}>Edit feature</Title>
        <TextInput
          id="featureName"
          name="feature_name"
          label="Feature name"
          required
          defaultValue={selectedFeature.feature_name}
          disabled={loading}
        />
        <Checkbox
          id="enabled"
          name="is_enabled"
          label="Enabled"
          defaultChecked={selectedFeature.is_enabled}
          disabled={loading}
        />
        <Stack direction="row">
          <Button
            onClick={() => setLoading(true)}
            disabled={loading}
            task={{
              slug: "demo_edit_feature",
              params: {
                feature_id: selectedFeature.feature_id,
                feature_name: featureNameState.value,
                is_enabled: enabledState.value,
              },
              refetchTasks: {
                slug: "demo_search_features",
              },
              onSuccess: () => {
                setLoading(false);
              },
              onError: (error) => {
                setLoading(false);
              },
            }}
          >
            Update
          </Button>
          <Button
            color="red"
            preset="secondary"
            onClick={() => setLoading(true)}
            disabled={loading}
            task={{
              slug: "demo_delete_feature",
              params: {
                feature_id: selectedFeature.feature_id,
              },
              refetchTasks: {
                slug: "demo_search_features",
              },
              onSuccess: () => {
                setLoading(false);
              },
              onError: (error) => {
                setLoading(false);
              },
            }}
            confirm={{
              title: "Do you want to delete this feature?",
              body: "You would be able to add it again if you want to",
              confirmText: "Yes",
              cancelText: "Cancel",
            }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

const CreateFeature = () => {
  const [loading, setLoading] = useState(false);
  const { id, open, close } = useComponentState();
  const { id: featureId, value: featureNameValue } = useComponentState();
  const { id: enabledId, value: enabledValue } = useComponentState();

  return (
    <>
      <Button onClick={open} sx={{ width: "150px" }}>
        Add new feature
      </Button>

      <Dialog id={id} title="Create feature" onClose={close}>
        <Card>
          <Stack>
            <TextInput
              id={featureId}
              name="feature_name"
              label="Feature name"
              required
              disabled={loading}
            />
            <Checkbox
              id={enabledId}
              name="is_enabled"
              label="Enabled"
              defaultChecked
              disabled={loading}
            />
            <Stack direction="row" justify="end">
              <Button
                onClick={() => setLoading(true)}
                task={{
                  slug: "demo_create_feature",
                  params: {
                    feature_name: featureNameValue,
                    is_enabled: enabledValue,
                  },
                  refetchTasks: {
                    slug: "demo_search_features",
                  },
                  onSuccess: () => {
                    close();
                    setLoading(false);
                  },
                  onError: (error) => {
                    close();
                    setLoading(false);
                  },
                }}
                loading={loading}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Dialog>
    </>
  );
};

const FeatureCustomers = ({ selectedFeature }) => {
  return (
    <Stack>
      <AddCustomerToFeature selectedFeature={selectedFeature} />
      <Stack direction="row" align="center" grow>
        <Table
          id="featureCustomers"
          title="Feature customers"
          columns={featureCustomersCols}
          defaultPageSize={5}
          task={{
            slug: "demo_search_feature_customers",
            params: {
              feature_id: selectedFeature.feature_id,
            },
          }}
          hiddenColumns={["feature_id", "customer_id"]}
          rowSelection="single"
          rowActions={(row: any) => {
            return (
              <Button
                preset="secondary"
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
                  },
                }}
                confirm={{
                  title: "Do you want to delete this customer?",
                  body: "You would be able to add them again if you want to",
                  confirmText: "Yes",
                  cancelText: "Cancel",
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

const AddCustomerToFeature = ({ selectedFeature }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>("");

  return (
    <>
      <Stack width="1/2" key={selectedFeature?.feature_id + "add_customer"}>
        <Title order={5}>Add customer to feature</Title>
        <Stack direction="row">
          <Select
            id="selectCustomer"
            task="demo_customers_list"
            outputTransform={(v) =>
              v.Q1.map(
                (customer) =>
                  customer.customer_id + " - " + customer.contact_name
              )
            }
            value={selectedCustomer ?? ""}
            placeholder="Select a customer"
            onChange={(value) => setSelectedCustomer(value)}
          />

          <Button
            sx={{ width: "150px" }}
            disabled={selectedCustomer == ""}
            task={{
              slug: "demo_create_feature_customer",
              params: {
                feature_id: selectedFeature?.feature_id,
                customer_id: selectedCustomer?.toString().split(" - ")[0] || "",
              },
              refetchTasks: {
                slug: "demo_search_feature_customers",
              },
              onSuccess: () => setSelectedCustomer(""),
              onError: () => setSelectedCustomer(""),
            }}
          >
            Add
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

const featuresCols = [
  { accessor: "feature_name", label: "Name" },
  { accessor: "updated_at", label: "Last updated", type: "date" },
  {
    accessor: "is_enabled",
    label: "Is enabled",
    type: "boolean",
  },
];

const featureCustomersCols = [
  { accessor: "contact_name", label: "Contact name" },
  { accessor: "address", label: "Address" },
  { accessor: "country", label: "Country" },
];

export default FeaturesDashboard;
