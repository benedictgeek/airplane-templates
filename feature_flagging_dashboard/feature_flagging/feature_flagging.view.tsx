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

const FeaturesDashboard = () => {
  const searchKeyword = useComponentState("searchKeyword");

  return (
    <Stack>
      <Title>Features dashboard</Title>
      <Text>Look up a feature and list customers subscribed to a feature</Text>
      <CreateFeature />
      <Stack direction="column">
        <Table
          id="features"
          title="Features"
          columns={featuresCols}
          defaultPageSize={5}
          task={{
            slug: "demo_search_features",
            params: { search_keyword: searchKeyword.value },
          }}
          rowSelection="single"
          showFilter={true}
          hiddenColumns={[]}
        />
      </Stack>
    </Stack>
  );
};

const CreateFeature = () => {
  const { values: createFeatureValues } = useComponentState("createNewFeature");

  const { mutate: createFeature } = useTaskMutation({
    slug: "demo_create_feature",
    params: {
      ...createFeatureValues,
    },
    onSuccess: () => {
      showNotification({ message: "Created feature!", type: "success" });
    },
    onError: (error) => {
      console.log("VALUES", createFeatureValues);
      showNotification({
        message: `Failed creating feature with error: ${error.message}`,
        type: "error",
      });
    },
  });

  return (
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
