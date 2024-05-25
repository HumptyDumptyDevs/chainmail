import { useAccount } from "wagmi";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { useEffect, useState } from "react";
import ListingTable from "@/components/ListingTable";
import ListingStatusBadge from "@/components/ListingStatusBadge";
import { formatEther } from "viem";
import { useNavigate } from "react-router-dom";

const MyListings = () => {
  const navigate = useNavigate();
  const account = useAccount();
  const chainmail = useChainmail();
  const [activeListings, setActiveListings] = useState<ListingData[]>([]);
  const [pendingListings, setPendingListings] = useState<ListingData[]>([]);
  const [completedListings, setCompletedListings] = useState<ListingData[]>([]);

  useEffect(() => {
    console.log(chainmail?.activeListings);

    // Filter active listings by status and owner
    const activeListings = chainmail?.activeListings?.filter(
      (listing) => listing.status === 0 && listing.owner === account?.address
    );

    if (activeListings) {
      setActiveListings(activeListings);
    }

    // Filter pending listings by status and owner
    const pendingListings = chainmail?.activeListings?.filter(
      (listing) => listing.status === 1 && listing.owner === account?.address
    );

    if (pendingListings) {
      setPendingListings(pendingListings);
    }

    // Filter completed listings by status and owner
    const completedListings = chainmail?.activeListings?.filter(
      (listing) => listing.status === 2 && listing.owner === account?.address
    );

    if (completedListings) {
      setCompletedListings(completedListings);
    }
  }, [chainmail?.activeListings, account?.address]);

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

  const fulfilRowActions = [
    {
      label: "Fulfil Order",
      onClick: (listing: ListingData) =>
        navigate(`/my-listings/fulfil/${listing.id}`),
    },
  ];

  return !account.address ? (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-text2">
        Connect your wallet to view your listings
      </h1>
    </div>
  ) : (
    <div>
      <h1 className="text-2xl font-bold text-text2 mb-4">Active Listings</h1>
      <div className="p-10 border border-primary1 bg-background3 shadow-xl rounded-lg mb-8">
        {activeListings.length > 0 ? (
          <ListingTable<ListingData> columns={columns} data={activeListings} />
        ) : (
          <div className="text-center">You don't have any active listings</div>
        )}
      </div>
      <h1 className="text-2xl font-bold text-text2 mb-4">Pending Listings</h1>
      <div className="p-10 border border-primary1 bg-background3 shadow-xl rounded-lg mb-8">
        {pendingListings.length > 0 ? (
          <ListingTable<ListingData>
            columns={columns}
            data={pendingListings}
            getRowActions={() => {
              return fulfilRowActions;
            }}
          />
        ) : (
          <div className="text-center">You don't have any pending listings</div>
        )}
      </div>
      <h1 className="text-2xl font-bold text-text2 mb-4">Completed Listings</h1>
      <div className="p-10 border border-primary1 bg-background3 shadow-xl rounded-lg mb-8">
        {completedListings.length > 0 ? (
          <ListingTable<ListingData>
            columns={columns}
            data={completedListings}
          />
        ) : (
          <div className="text-center">
            You don't have any completed listings
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
