import {
  Stack,
  Table,
  Text,
  Title,
  TextInput,
  useComponentState,
  Column,
  TextInputState,
  TableState,
} from "@airplane/views";
import airplane from "airplane";
import { useDebounce } from "use-debounce";

const Dashboard = () => {
  const customerSearch = useComponentState<TextInputState>(); // Component state of the customer search TextInput.
  const customerTable = useComponentState<TableState>(); // Component state of the customer Table.
  const selectedCustomer = customerTable.selectedRow;
  // Debounce the search value so we don't execute a task on every keystroke.
  const [searchValue] = useDebounce(customerSearch.value, 500);

  return (
    <Stack>
      <Title>Stripe billing dashboard</Title>
      <Text>
        Lookup customers by their name or email, view all charges for that
        customer, and refund a charge if needed.
      </Text>
      <TextInput id={customerSearch.id} label="Search for a customer" />
      {searchValue && (
        <Table
          id={customerTable.id}
          title="Search results"
          task={{
            slug: "demo_list_stripe_customers",
            params: { search_keyword: searchValue },
          }}
          rowSelection="single"
          showFilter={false}
          hiddenColumns={["id"]}
          columns={stripeCustomersCols}
        />
      )}
      {selectedCustomer && (
        <Stack>
          <Table
            title="Customer details"
            task={{
              slug: "demo_lookup_stripe_customer",
              params: { customer_id: selectedCustomer.id },
            }}
            showFilter={false}
            columns={customerDetailsCols}
          />
          <Table
            title="Charges for this customer"
            task={{
              slug: "demo_lookup_charges_for_stripe_customer",
              params: { customer_id: selectedCustomer.id },
            }}
            hiddenColumns={["currency", "description"]}
            columns={customerChargesCols}
            rowActions={[
              {
                slug: "demo_refund_stripe_charge",
                label: "Refund",
                rowTransform: (r) => ({ charge_id: r.id }),
              },
            ]}
          />
        </Stack>
      )}
    </Stack>
  );
};

const stripeCustomersCols: Column[] = [
  {
    label: "Email",
    accessor: "email",
  },
  {
    label: "Name",
    accessor: "name",
  },
];

const customerDetailsCols: Column[] = [
  {
    label: "Customer ID",
    accessor: "id",
  },
  {
    label: "Email",
    accessor: "email",
  },
  {
    label: "Currency",
    accessor: "currency",
  },
  {
    label: "Next invoice sequence",
    accessor: "next_invoice_sequence",
    type: "number",
  },
  {
    label: "Name",
    accessor: "name",
  },
];

const customerChargesCols: Column[] = [
  {
    label: "Charge date",
    accessor: "created_at",
    type: "date",
  },
  {
    label: "Charge ID",
    accessor: "id",
  },
  {
    label: "Amount",
    accessor: "amount",
    type: "number",
  },
  {
    label: "Amount refunded",
    accessor: "amount_refunded",
    type: "number",
  },
  {
    label: "Paid",
    accessor: "paid",
    type: "boolean",
  },
  {
    label: "Status",
    accessor: "status",
  },
];

export default airplane.view(
  {
    slug: "demo_stripe_dashboard",
    name: "Stripe dashboard",
    description:
      "Stripe billing dashboard for looking up customers and refunding charges.",
  },
  Dashboard
);
