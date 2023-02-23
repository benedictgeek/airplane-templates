import {
  Button,
  Card,
  Link,
  Image,
  Stack,
  Text,
  TextInput,
  Title,
  useComponentState,
} from "@airplane/views";
import airplane from "airplane";

// Views documentation: https://docs.airplane.dev/views/getting-started
const GitHubPRDashboard = () => {
  const userName = useComponentState();
  const search = useComponentState();

  const output = search.result?.output;
  const error = search.result?.error;

  return (
    <Stack spacing="xl">
      <Title>GitHub pull request dashboard</Title>
      <Stack direction="row" align="end">
        <TextInput
          id={userName.id}
          label="Username"
          placeholder="Type a GitHub username"
        />
        <Button
          id={search.id}
          task={{
            slug: "demo_list_github_pull_requests",
            params: { user: userName.value },
          }}
          disabled={!userName.value}
        >
          Search
        </Button>
      </Stack>

      {output && !error && (
        <>
          <Stack direction="row" spacing="lg" wrap>
            <Card
              radius="xs"
              style={{ overflow: "auto" }}
              height="128u"
              width="1/2"
              grow
            >
              <Stack>
                <Title order={3}>‍💻 Open PRs</Title>
                {output.authored.map((pr) => (
                  <PR pr={pr} />
                ))}
                {!output.authored.length && <Text size="xl">None</Text>}
              </Stack>
            </Card>
            <Card radius="xs" style={{ overflow: "auto" }} height="128u" grow>
              <Stack>
                <Title order={3}>✅ Approved PRs</Title>
                {output.approved.map((pr) => (
                  <PR pr={pr} />
                ))}
                {!output.approved.length && <Text size="xl">None</Text>}
              </Stack>
            </Card>
          </Stack>
          <Card
            radius="xs"
            width="full"
            style={{ height: 500, overflow: "auto" }}
          >
            <Stack>
              <Title order={3}>✏️ PRs to review</Title>
              {output.toReview.map((pr) => (
                <PR pr={pr} />
              ))}
              {!output.toReview.length && <Text size="xl">None</Text>}
            </Stack>
          </Card>
        </>
      )}
    </Stack>
  );
};

const PR = ({ pr }) => {
  return (
    <Card>
      <Stack direction="row" justify="space-between">
        <Link size="md" href={pr.url}>
          {pr.title}
        </Link>
        <Text color="gray.5">{`Comments: ${pr.numComments}`}</Text>
      </Stack>
      {pr.body && <Text lineClamp={4}>{pr.body}</Text>}
      <Stack direction="row" align="center" spacing="sm">
        {pr.avatar && <Image imageWidth="48px" src={pr.avatar} />}
        <Text size="sm">{pr.author}</Text>
      </Stack>
    </Card>
  );
};

export default airplane.view(
  {
    slug: "demo_github_pull_request_dashboard",
    name: "GitHub pull request dashboard",
  },
  GitHubPRDashboard
);
