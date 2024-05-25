import { useState, useEffect } from "react";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import ListingTable from "@/components/ListingTable";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";

const MyListingOrders = () => {
  const account = useAccount();
  const navigate = useNavigate();
  const chainmail = useChainmail();
  const [disputes, setDisputes] = useState<ListingData[]>([]);

  useEffect(() => {
    const disputedListings = chainmail?.activeListings?.filter(
      (listing) => listing.buyer === account.address && listing.status === 3
    );
    if (disputedListings) {
      setDisputes(disputedListings);
    }
  }, [chainmail?.activeListings, account.address]);

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
        <StatusBadge status={listing.status} />
      ),
    },
    {
      header: "Actions",
      accessor: (listing: ListingData) => (
        <div className="flex gap-4">
          <button
            className="btn btn-error btn-outline"
            onClick={() => navigate(`/disputes/${listing.id}`)}
          >
            View Dispute
          </button>
        </div>
      ),
    },
  ];

  return !account.address ? (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-text2">
        Connect your wallet to view disputes
      </h1>
    </div>
  ) : (
    <div>
      <h1 className="text-2xl font-bold text-text2 mb-4">Disputes</h1>
      <div className="p-10 border border-primary1 bg-background3 shadow-xl rounded-lg">
        {disputes.length > 0 ? (
          <ListingTable<ListingData> columns={columns} data={disputes} />
        ) : (
          <div className="text-center">There are no disputes</div>
        )}
      </div>
    </div>
  );
};

export default MyListingOrders;
