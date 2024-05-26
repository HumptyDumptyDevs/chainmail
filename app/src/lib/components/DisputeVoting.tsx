import React, { useEffect, useState } from "react";
import { DisputeCountdown, TransactionToast, VotesBar } from "@/lib/components";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { abi } from "@/lib/abi/abiChainmail";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { formatEther, parseEther } from "viem";

type DisputeVotingProps = {
  dispute: DisputeData;
  listing: ListingData;
  voteStatus: boolean;
};

const DisputeVoting = ({
  listing,
  dispute,
  voteStatus,
}: DisputeVotingProps) => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const [votingDisabled, setVotingDisabled] = useState(false);
  const [votingPower, setVotingPower] = useState("0");
  const chainmail = useChainmail();

  console.log(dispute);

  const getWinnerOfVote = () => {
    const votesForBuyer = dispute.votesForBuyer;
    const votesForOwner = dispute.votesForOwner;

    if (votesForBuyer > votesForOwner) {
      return "Buyer";
    } else if (votesForBuyer < votesForOwner) {
      return "Seller";
    }
  };

  useEffect(() => {
    if (!chainmail?.myTokenBalance) return;

    if (
      chainmail?.myTokenBalance === 0n ||
      voteStatus ||
      listing.status === 3
    ) {
      setVotingDisabled(true);
    }

    setVotingPower(formatEther(chainmail?.myTokenBalance));
  }, [chainmail?.myTokenBalance, listing.status]);

  const vote = async (voteForBuyer: boolean) => {
    console.log(`Voting for ${voteForBuyer ? "buyer" : "seller"}`);
    console.log(
      `With address ${import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS}`
    );
    console.log(`For ListingId ${dispute.listingId}`);
    writeContract({
      address: import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "vote",
      args: [voteForBuyer, dispute.listingId],
    });
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  console.log(dispute);
  return (
    <>
      <h2 className="text-text1 text-4xl font-semibold text-center">Voting</h2>
      <div className="text-text2 text-lg text-center">
        Voting Power: <span>{votingPower}</span>
      </div>
      <VotesBar
        voteForBuyer={Number(dispute.votesForBuyer)}
        votesForSeller={Number(dispute.votesForOwner)}
      />
      <div className="flex justify-between p-20 items-center">
        <button
          className="btn btn-secondary"
          disabled={votingDisabled}
          onClick={() => {
            vote(true);
          }}
        >
          Vote for buyer
        </button>
        <div className="flex flex-col justify-center items-center">
          {listing.status === 4 ? (
            <>
              <h3 className="text-text2 text-lg">Time Remaining</h3>
              <DisputeCountdown createdAt={dispute.createdAt} />
            </>
          ) : (
            <>
              <h3 className="text-text2 text-lg">Dispute Resolved</h3>
              <h3 className="text-text2 text-lg font-bold">
                {" "}
                Winner: {getWinnerOfVote()}
              </h3>
            </>
          )}
        </div>
        <button
          className="btn btn-accent"
          disabled={votingDisabled}
          onClick={() => {
            vote(false);
          }}
        >
          Vote for seller
        </button>
      </div>
      <TransactionToast
        isConfirmed={isConfirmed}
        isConfirming={isConfirming}
        error={error}
        hash={hash}
      />
    </>
  );
};

export default DisputeVoting;
