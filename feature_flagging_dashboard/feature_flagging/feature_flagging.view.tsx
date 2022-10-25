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
      <Stack direction="row" align="center">
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

const IsEnabledComponent = ({ is_enabled }) => {
  const text = is_enabled == true ? "Enabled" : "Disabled";
  const bgColor = is_enabled == true ? "lightcyan" : "lightgoldenrodyellow";
  return (
    <Card withBorder={false} p="sm" sx={{ background: bgColor }}>
      <Text sx={{ fontWeight: 500 }}>{text}</Text>
    </Card>
  );
};

const featuresCols = [
  { accessor: "feature_id", label: "Feature ID" },
  { accessor: "feature_name", label: "Feature name" },
  { accessor: "updated_at", label: "Last update" },
  {
    accessor: "is_enabled",
    label: "Is enabled",
    component: IsEnabledComponent,
  },
];

export default FeaturesDashboard;
