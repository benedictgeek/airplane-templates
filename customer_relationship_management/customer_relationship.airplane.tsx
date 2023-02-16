import {
  Button,
  Stack,
  Table,
  Title,
  Card,
  useComponentState,
  Dialog,
  Column,
  Tabs,
  Form,
  Label,
  Chip,
} from "@airplane/views";
import airplane from "airplane";

const CustomerRelationshipDashboard = () => {
  return (
    <Stack>
      <Stack direction="row" justify="space-between">
        <Title>CRM</Title>
        <CreateLeadButton />
      </Stack>
      <Tabs defaultValue="lead">
        <Tabs.Tab value="lead" label="Leads">
          <CustomerTable key="lead" stage="lead" />
        </Tabs.Tab>
        <Tabs.Tab value="opportunity" label="Opportunities">
          <CustomerTable key="opp" stage="opportunity" />
        </Tabs.Tab>
        <Tabs.Tab value="customer" label="Customers">
          <CustomerTable key="cust" stage="customer" />
        </Tabs.Tab>
      </Tabs>
    </Stack>
  );
};

/** A list of all customers in the given stage. */
const CustomerTable = ({
  stage,
}: {
  stage: "lead" | "opportunity" | "customer";
}) => {
  const customersTableState = useComponentState();
  let selectedCustomer: CustomerRowType = customersTableState.selectedRow;

  return (
    <Stack>
      <Table
        id={customersTableState.id}
        title="Customers"
        columns={customersCols}
        defaultPageSize={5}
        task={{
          slug: "demo_list_customers_by_stage",
          params: {
            opportunity_stage: stage,
          },
        }}
        hiddenColumns={[
          "customer_id",
          "country",
          "contact_title",
          "opportunity_stage",
          "address",
          "touch_points",
        ]}
        rowSelection="single"
        rowActions={{
          slug: "demo_edit_customer",
          label: "Update",
        }}
      />
      {selectedCustomer && (
        <>
          <Stack direction="row" align="start">
            <CustomerCard
              selectedCustomer={selectedCustomer}
              onDelete={() => {
                customersTableState.clearSelection();
              }}
            />
            <Table
              grow
              title="Customer touch points"
              task={{
                slug: "demo_list_customer_touch_points",
                params: {
                  customer_id: selectedCustomer.customer_id,
                },
              }}
              noData="There are no touch points for this user"
              rowActions={{
                slug: "demo_delete_touch_point_for_customer",
                label: "Delete",
                preset: "danger",
                confirm: {
                  title: "Do you want to delete this touch point?",
                  confirmText: "Yes",
                  cancelText: "Cancel",
                  body: "",
                },
              }}
              hiddenColumns={["customer_id"]}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
};

/**
 * Displays details about a customer.
 * Supports customer promotion, deletion, and touch point creation.
 */
const CustomerCard = ({
  selectedCustomer,
  onDelete,
}: {
  selectedCustomer: CustomerRowType;
  onDelete: () => void;
}) => {
  const nextStage = getNextStage(selectedCustomer.opportunity_stage);
  return (
    <Card width="1/3">
      <Stack>
        <Stack direction="row" justify="space-between" align="center">
          <Label size="lg">{selectedCustomer.contact_name}</Label>
          <Chip color="green">{selectedCustomer.contact_title}</Chip>
        </Stack>
        <Label color="gray">{selectedCustomer.phone}</Label>
        <Label color="gray">
          {`${selectedCustomer.address}, ${selectedCustomer.country}`}
        </Label>

        <Stack direction="row" justify="end">
          {nextStage && (
            <Button
              preset="secondary"
              task={{
                slug: "demo_update_customer_stage",
                params: {
                  opportunity_stage: nextStage,
                  customer_id: selectedCustomer.customer_id,
                },
                refetchTasks: {
                  slug: "demo_list_customers_by_stage",
                },
                onSuccess: () => {
                  onDelete();
                },
              }}
              disabled={selectedCustomer.opportunity_stage == "customer"}
              confirm={{
                title: `Do you want to upgrade this customer to ${nextStage}?`,
                body: "",
                confirmText: "Yes",
                cancelText: "Cancel",
              }}
            >
              {`Convert to ${nextStage}`}
            </Button>
          )}
          <CreateTouchPointButton selectedCustomer={selectedCustomer} />
          <Button
            preset="danger"
            task={{
              slug: "demo_delete_customer",
              params: {
                customer_id: selectedCustomer.customer_id,
              },
              onSuccess: () => {
                onDelete();
              },
              refetchTasks: {
                slug: "demo_list_customers_by_stage",
                params: {
                  opportunity_stage: selectedCustomer.opportunity_stage,
                },
              },
            }}
            confirm={{
              title: `Do you want to delete this customer?`,
              body: `You can create another entry at any time`,
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

/** Button that creates a new lead via user input. */
const CreateLeadButton = () => {
  const dialogState = useComponentState();

  return (
    <>
      <Button preset="secondary" onClick={dialogState.open}>
        Create lead
      </Button>

      <Dialog
        id={dialogState.id}
        title="Create lead"
        onClose={dialogState.close}
      >
        <Form task="demo_create_lead"></Form>
      </Dialog>
    </>
  );
};

/** Button that creates a new touch point via user input. */
const CreateTouchPointButton = ({
  selectedCustomer,
}: {
  selectedCustomer: CustomerRowType;
}) => {
  const dialogState = useComponentState();

  return (
    <>
      <Button preset="secondary" onClick={dialogState.open}>
        Add touch point
      </Button>

      <Dialog
        id={dialogState.id}
        title="Add touch point"
        onClose={dialogState.close}
      >
        <Card>
          <Stack>
            <Form
              task={{
                slug: "demo_create_touch_point_for_customer",
                hiddenFields: ["customer_id"],
                fieldOptions: [
                  { slug: "customer_id", value: selectedCustomer.customer_id },
                  {
                    slug: "touch_point_type",
                    allowedValues: ["email", "phone", "video", "in person"],
                  },
                ],
              }}
            />
          </Stack>
        </Card>
      </Dialog>
    </>
  );
};

interface CustomerRowType {
  customer_id: string;
  company_name: string;
  contact_name: string;
  contact_title: string;
  address: string;
  country: string;
  opportunity_stage: string;
  phone: string;
  touch_points: number;
}

const customersCols = [
  { accessor: "company_name", label: "Company name", canEdit: true },
  { accessor: "contact_name", label: "Contact name", canEdit: true },
  { accessor: "contact_title", label: "Contact title", canEdit: true },
  { accessor: "country", label: "Country", canEdit: true },
  { accessor: "phone", label: "Phone number", canEdit: true },
  { accessor: "opportunity_stage", label: "Stage" },
] satisfies Column[];

const getNextStage = (currentStage: string) => {
  switch (currentStage) {
    case "lead":
      return "opportunity";
    case "opportunity":
      return "customer";
    default:
      break;
  }
};

export default airplane.view(
  {
    slug: "demo_customer_relationship",
    name: "Customer relationship management dashboard",
  },
  CustomerRelationshipDashboard
);
