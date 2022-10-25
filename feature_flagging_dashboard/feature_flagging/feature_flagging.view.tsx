import {
  Button,
  Stack,
  Table,
  Text,
  Title,
  TextInput,
  Card,
  useComponentState,
  Divider,
} from "@airplane/views";

const FeaturesDashboard = () => {
  const searchKeyword = useComponentState("searchKeyword");

  return (
    <Stack>
      <Title>Features dashboard</Title>
      <Text>Look up a feature and list customers subscribed to a feature</Text>
      <Stack direction="row" align="end">
        <TextInput id="searchKeyword" label="Search for a feature" />
      </Stack>
      <Stack direction="row" align="center">
        <Table
          id="features"
          title="Features"
          columns={featuresCols}
          task={{
            slug: "demo_search_features",
            params: { search_keyword: searchKeyword.value },
          }}
          rowSelection="single"
          showFilter={false}
          hiddenColumns={["updated_at"]}
        />
      </Stack>
    </Stack>
  );
};

const featuresCols = [
  { accessor: "feature_id", label: "Feature ID" },
  { accessor: "feature_name", label: "Feature name" },
  { accessor: "is_enabled", label: "Is enabled" },
  { accessor: "updated_at", label: "Updated at" },
];

export default FeaturesDashboard;
