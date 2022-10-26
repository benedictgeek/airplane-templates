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
} from "@airplane/views";

import dayjs from "dayjs";
import { useState } from "react";
import FeatureCustomers from "./components/feature_customers";

const searchFeaturesSlug = "demo_search_features";

const FeaturesDashboard = () => {
  const searchKeyword = useComponentState("searchKeyword");
  const featuresTable = useComponentState("features");
  const selectedFeature = featuresTable.selectedRow;

  return (
    <Stack>
      <Title>Features dashboard</Title>
      <Text>Look up a feature and list customers subscribed to a feature</Text>
      <CreateFeature key={"createFestureCard"} searchKeyword={searchKeyword} />

      <Stack direction="row" align="center" grow>
        <Table
          id="features"
          title="Features"
          columns={featuresCols}
          defaultPageSize={5}
          task={{
            slug: searchFeaturesSlug,
            params: { search_keyword: searchKeyword.value },
          }}
          rowSelection="single"
          showFilter={true}
          hiddenColumns={[]}
        />
        {selectedFeature && (
          <EditFeature
            selectedFeature={selectedFeature}
            searchKeyword={searchKeyword}
          />
        )}
      </Stack>
      {selectedFeature && (
        <FeatureCustomers selectedFeature={selectedFeature} />
      )}
    </Stack>
  );
};

const EditFeature = ({ selectedFeature, searchKeyword }) => {
  const featureName = useComponentState("editFeatureName");
  const isEnabled = useComponentState("editFeatureEnabled");

  return (
    <Card key={selectedFeature.feature_id}>
      <Stack>
        <Title order={4}>Edit feature</Title>
        <TextInput
          id="editFeatureName"
          name="feature_name"
          label="Feature name"
          required
          defaultValue={selectedFeature.feature_name}
        />
        <Checkbox
          id="editFeatureEnabled"
          name="is_enabled"
          label="Enable?"
          defaultChecked={selectedFeature.is_enabled}
        />
        <Button
          task={{
            slug: "demo_edit_feature",
            params: {
              feature_id: selectedFeature.feature_id,
              feature_name: featureName.value,
              is_enabled: isEnabled.value,
            },
            refetchTasks: {
              slug: searchFeaturesSlug,
              params: { search_keyword: searchKeyword.value },
            },
          }}
        >
          Update
        </Button>
        <Divider />
        <Title order={5}>Do you want to delete this feature?</Title>
        <Button
          color="red"
          task={{
            slug: "demo_delete_feature",
            params: {
              feature_id: selectedFeature.feature_id,
            },
            refetchTasks: {
              slug: searchFeaturesSlug,
              params: { search_keyword: searchKeyword.value },
            },
          }}
        >
          Delete feature
        </Button>
      </Stack>
    </Card>
  );
};

const CreateFeature = ({ searchKeyword }) => {
  const [toggleCreateButton, setToggleButton] = useState(true);
  const { values: createFeatureValues } = useComponentState("createNewFeature");

  const { mutate: createFeature } = useTaskMutation({
    slug: "demo_create_feature",
    params: {
      ...createFeatureValues,
    },
    refetchTasks: {
      slug: searchFeaturesSlug,
      params: { search_keyword: searchKeyword.value },
    },
    onSuccess: () => {
      setToggleButton(true);
      showNotification({ message: "Created feature!", type: "success" });
    },
    onError: (error) => {
      setToggleButton(true);
      showNotification({
        message: `Failed creating feature with error: ${error.message}`,
        type: "error",
      });
    },
  });

  return (
    <>
      {toggleCreateButton ? (
        <Button onClick={() => setToggleButton(false)} sx={{ width: "150px" }}>
          Add new feature
        </Button>
      ) : (
        <Stack.Item width="1/2">
          <Title order={4}>Create feature</Title>
          <Form
            id="createNewFeature"
            onSubmit={() => {
              createFeature();
            }}
            resetOnSubmit
          >
            <TextInput
              id="feature_name"
              name="feature_name"
              label="Feature name"
              required
            />
            <Checkbox
              id="is_enabled"
              name="is_enabled"
              label="Enable?"
              defaultChecked
            />
          </Form>
        </Stack.Item>
      )}
    </>
  );
};

const IsEnabledComponent = ({ is_enabled }) => {
  const text = is_enabled == true ? "Enabled" : "Disabled";
  const bgColor = is_enabled == true ? "lightcyan" : "lightgoldenrodyellow";
  return (
    <Card withBorder={false} p="sm" sx={{ background: bgColor }}>
      <Text sx={{ fontWeight: 500 }}>{text}</Text>
    </Card>
  );
};

const FormatDate = ({ updated_at }) => {
  return <Text>{dayjs(updated_at).format("DD/MM/YYYY, hh:mm:ss A")}</Text>;
};

const featuresCols = [
  { accessor: "feature_id", label: "Feature ID" },
  { accessor: "feature_name", label: "Feature name" },
  { accessor: "updated_at", label: "Last update", component: FormatDate },
  {
    accessor: "is_enabled",
    label: "Is enabled",
    component: IsEnabledComponent,
  },
];

export default FeaturesDashboard;
