import {
  DisputeInformation,
  DisputeVoting,
  ListingInformation,
} from "@/lib/components";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useReadContracts, useWatchContractEvent } from "wagmi";
import { abi } from "@/lib/abi/abiChainmail";

const ViewDispute = () => {
  const params = useParams();
  const chainmail = useChainmail();
  const account = useAccount();
  const [listing, setListing] = useState<ListingData | undefined>(undefined);
  const [voteStatus, setVoteStatus] = useState<boolean>(false); // [1
  const [dispute, setDispute] = useState<DisputeData>({
    listingId: BigInt(0),
    buyersSecretPgpKey: "" as `0x${string}`,
    votesForBuyer: BigInt(0),
    votesForOwner: BigInt(0),
    createdAt: BigInt(0),
    reason: "",
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
      {
        ...chainmailContractConfig,
        functionName: "getVoteStatusOfListing",
        args: [
          BigInt(parseInt(params.id as string)),
          account?.address as `0x${string}`,
        ],
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
      setVoteStatus(disputeResponse[1].result as boolean); // [2
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
        <DisputeVoting
          listing={listing}
          dispute={dispute}
          voteStatus={voteStatus}
        />
      </div>
    )
  );
};

export default ViewDispute;
