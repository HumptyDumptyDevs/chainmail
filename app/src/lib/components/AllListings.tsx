import ListingTable from "@/components/ListingTable";
import { formatEther } from "viem";
import StatusBadge from "@/components/StatusBadge";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { useNavigate } from "react-router-dom";
import * as decode from "@/lib/utils/decodePublicSignals";
import { useEffect, useState } from "react";
import MailIcon from "./icons/MailIcon";

const AllListings = () => {
  const chainmail = useChainmail();
  const navigate = useNavigate();
  const [activeListings, setActiveListings] = useState<ListingData[]>([]);

  useEffect(() => {
    console.log(chainmail?.activeListings);
    const nonExpiredListings = chainmail?.activeListings?.filter(
      (listing) => listing.status === 0
    );
    if (nonExpiredListings) {
      setActiveListings(nonExpiredListings);
    }
  }, [chainmail?.activeListings]);

  console.log(activeListings);

  const columns = [
    { header: "", accessor: () => <MailIcon classList="w-14 stroke-text3" /> },
    { header: "ID", accessor: (listing: ListingData) => listing.id.toString() },
    {
      header: "From",
      accessor: (listing: ListingData) =>
        decode.decimalToAscii(listing.proof.pubSignals[3].toString()),
    },
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
  ];

  const getRowActions = (listing: ListingData) => {
    console.log(listing);
    return [
      {
        label: "Buy",
        onClick: () => navigate(`/listing/${listing.id}`),
      },
    ];
  };

  return (
    <ListingTable<ListingData>
      columns={columns}
      data={activeListings}
      getRowActions={getRowActions}
    />
  );
};

export default AllListings;