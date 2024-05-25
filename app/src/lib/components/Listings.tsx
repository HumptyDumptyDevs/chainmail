import ListingTable from "@/components/ListingTable";
import { formatEther } from "viem";
import StatusBadge from "@/components/StatusBadge";

interface Listings {
  id: number;
  from: string;
  description: string;
  price: string;
  status: string;
  timeRemaining: string;
}

const Listings = () => {
  // Sample data
  const listings = [
    {
      id: 1,
      from: "Jack",
      description: "Recipe for potions",
      price: formatEther(1000000000000000000n),
      status: <StatusBadge status={0} />,
      timeRemaining: "1 day",
    },
  ];

  const columns = [
    { header: "ID", accessor: (listing: Listings) => listing.id },
    { header: "From", accessor: (listing: Listings) => listing.from },
    {
      header: "Description",
      accessor: (listing: Listings) => listing.description,
    },
    { header: "Price", accessor: (listing: Listings) => listing.price },
    { header: "Status", accessor: (listing: Listings) => listing.status },
    {
      header: "Time Remaining",
      accessor: (listing: Listings) => listing.timeRemaining,
    },
  ];

  // Define your row actions (optional)
  interface Listings {
    id: number;
    from: string;
    description: string;
    price: string;
    status: JSX.Element; // Update the type of 'status' property
    timeRemaining: string;
  }

  const getRowActions = (listing: Listings) => [
    {
      label: "Buy",
      onClick: (listing: Listings) => console.log("Buy listing:", listing),
    },
  ];

  return (
    <ListingTable<Listings>
      columns={columns}
      data={listings}
      getRowActions={getRowActions}
    />
  );
};

export default Listings;
