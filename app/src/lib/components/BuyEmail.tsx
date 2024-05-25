import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { abi } from "@/lib/abi/abiChainmail";
import { convertStringToHex } from "@/lib/utils/utils";
import { useChainmail } from "@/lib/context/ChainmailContext";

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
      <div className="pt-4">
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    </div>
  );
};

export default BuyEmail;
