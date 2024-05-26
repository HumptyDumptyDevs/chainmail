import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { abi } from "@/lib/abi/abiChainmail";
import { convertStringToHex } from "@/lib/utils/utils";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { TransactionToast } from "@/lib/components/";

type BuyEmailProps = {
  listingId: bigint;
  pgpPublicKey: string;
  listingPrice: bigint;
};

const BuyEmail = ({ listingId, pgpPublicKey, listingPrice }: BuyEmailProps) => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const chainmail = useChainmail();

  const hexPgpPublicKey = convertStringToHex(pgpPublicKey);

  const stakeOfAuthenticity = chainmail?.stakeOfAuthenticity || 0;

  const buyEmail = async () => {
    writeContract({
      address: import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "purchaseListing",
      args: [listingId, hexPgpPublicKey as `0x${string}`],
      value: listingPrice + BigInt(stakeOfAuthenticity),
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        disabled={isPending}
        onClick={buyEmail}
        className="btn btn-lg btn-primary"
      >
        {isPending ? "Confirming..." : "Buy Email"}
      </button>
      <TransactionToast
        isConfirmed={isConfirmed}
        isConfirming={isConfirming}
        error={error}
        hash={hash}
      />
    </div>
  );
};

export default BuyEmail;
