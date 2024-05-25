import ListingTable from "@/components/ListingTable";
import { formatEther } from "viem";
import StatusBadge from "@/components/StatusBadge";

const AllListings = () => {
  // Sample data
  const listings = [
    {
      id: 1,
      from: "Jack",
      description: "Recipe for potions",
      price: "Ξ " + formatEther(1000000000000000000n),
      status: <StatusBadge status={0} />,
      createdAt: "1 day",
    },
    {
      id: 2,
      from: "Charlie",
      description: "Recipe for antidotes",
      price: "Ξ " + formatEther(2000000000000000000n),
      status: <StatusBadge status={1} />,
      createdAt: "1 day",
    },
  ];

  const columns = [
    { header: "ID", accessor: (listing: ListingData) => listing.id },
    { header: "From", accessor: (listing: ListingData) => listing.owner },
    {
      header: "Description",
      accessor: (listing: ListingData) => listing.description,
    },
    { header: "Price", accessor: (listing: ListingData) => listing.price },
    { header: "Status", accessor: (listing: ListingData) => listing.status },
    {
      header: "Time Remaining",
      accessor: (listing: ListingData) => listing.createdAt,
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
    <ListingTable<ListingData>
      columns={columns}
      data={listings}
      getRowActions={getRowActions}
    />
  );
};

export default AllListings;
