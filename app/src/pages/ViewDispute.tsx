import { DisputeInformation, ListingInformation } from "@/lib/components";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useReadContracts, useWatchContractEvent } from "wagmi";
import { abi } from "@/lib/abi/abiChainmail";

const ViewDispute = () => {
  const params = useParams();
  const chainmail = useChainmail();
  const [listing, setListing] = useState<ListingData | undefined>(undefined);
  const [dispute, setDispute] = useState<DisputeData>({
    listingId: BigInt(0),
    buyersSecretPgpKey: "" as `0x${string}`,
    votesForBuyer: BigInt(0),
    votesForOwner: BigInt(0),
    createdAt: BigInt(0),
  });

  const chainmailContractConfig = {
    address: import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS as `0x${string}`,
    abi: abi,
  };

  const {
    data: disputeResponse,
    isLoading: disputeLoading,
    refetch: refetchDispute,
    error: disputeError,
  } = useReadContracts({
    contracts: [
      {
        ...chainmailContractConfig,
        functionName: "getDispute",
        args: [BigInt(parseInt(params.id as string))],
      },
    ],
  });

  useWatchContractEvent({
    ...chainmailContractConfig,
    eventName: "ListingDisputeUpdated",
    onLogs(logs) {
      refetchDispute();
    },
    onError(error) {
      console.error("Listing Dispute Updated Error:", error);
    },
  });

  useEffect(() => {
    if (disputeResponse) {
      setDispute(disputeResponse[0].result as DisputeData);
    }
  }, [disputeResponse, disputeLoading, disputeError]);

  useEffect(() => {
    const foundListing = chainmail?.activeListings?.find(
      (listing) => `${listing.id}` === params.id
    );
    setListing(foundListing); // Set the found listing as state
  }, [chainmail?.activeListings, params.id]);

  return (
    listing && ( // If listing is not undefined
      <div className="max-w-7xl mx-auto">
        <ListingInformation listing={listing} />
        <DisputeInformation listing={listing} dispute={dispute} />
      </div>
    )
  );
};

export default ViewDispute;
