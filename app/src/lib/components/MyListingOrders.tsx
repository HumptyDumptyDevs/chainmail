import { useState, useEffect } from "react";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import ListingTable from "@/components/ListingTable";
import { useNavigate } from "react-router-dom";
import ListingStatusBadge from "@/components/ListingStatusBadge";

const MyListingOrders = () => {
  const account = useAccount();
  const navigate = useNavigate();
  const chainmail = useChainmail();
  const [myOrders, setMyOrders] = useState<ListingData[]>([]);

  useEffect(() => {
    console.log(chainmail?.buyersListings);
    const myOrders = chainmail?.buyersListings?.filter(
      (listing) => listing.buyer === account.address
    );
    if (myOrders) {
      setMyOrders(myOrders);
    }
  }, [chainmail?.buyersListings, account.address]);

  const columns = [
    { header: "ID", accessor: (listing: ListingData) => listing.id.toString() },
    {
      header: "Description",
      accessor: (listing: ListingData) => listing.description,
    },
    {
      header: "Price",
      accessor: (listing: ListingData) => `${formatEther(listing.price)} Ξ`,
    },
    {
      header: "Status",
      accessor: (listing: ListingData) => (
        <ListingStatusBadge status={listing.status} />
      ),
    },
  ];

  const getRowActions = (listing: ListingData) => {
    return [
      {
        label: "View Order",
        onClick: () => navigate(`/my-orders/${listing.id}`),
      },
    ];
  };

  return !account.address ? (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-text2">
        Connect your wallet to view your orders
      </h1>
    </div>
  ) : (
    <div>
      <h1 className="text-2xl font-bold text-text2 mb-4">My Orders</h1>
      <div className="p-10 border border-primary1 bg-background3 shadow-xl rounded-lg">
        {myOrders.length > 0 ? (
          <ListingTable<ListingData>
            columns={columns}
            data={myOrders}
            getRowActions={getRowActions}
          />
        ) : (
          <div className="text-center">You don't have an order history</div>
        )}
      </div>
    </div>
  );
};

export default MyListingOrders;
