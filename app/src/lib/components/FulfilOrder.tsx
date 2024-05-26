import { useEffect, useState } from "react";
import { encryptMessage } from "@/lib/utils/pgp";
import { convertHexToString, convertStringToHex } from "@/lib/utils/utils";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { abi } from "@/lib/abi/abiChainmail";
import { TransactionToast } from "@/lib/components";

type FulfilOrderProps = {
  listing: ListingData;
};

const FulfilOrder = ({ listing }: FulfilOrderProps) => {
  const [emailBody, setEmailBody] = useState<string>("");

  const { data: hash, error, writeContract } = useWriteContract();

  useEffect(() => {
    const storedEmailBodyMap = JSON.parse(
      localStorage.getItem("emailBodyMap") || "{}"
    );
    const listingIdString = listing.id.toString();
    const storedEmailBody = storedEmailBodyMap[listingIdString];

    if (storedEmailBody) {
      setEmailBody(storedEmailBody);
    } else {
      // Optionally show a message if no email body is found for the listing
      console.warn(
        "No email body found in localStorage for listing:",
        listingIdString
      );
    }
  }, [listing.id]);

  console.log(listing);

  const fulfilOrder = async () => {
    console.log(listing.buyersPublicPgpKey as string);

    const encryptedBody = await encryptMessage(
      emailBody,
      convertHexToString(listing.buyersPublicPgpKey as string)
    );

    const hexEncryptedBody = convertStringToHex(encryptedBody as string);

    writeContract({
      address: import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "fulfilListing",
      args: [listing.id, hexEncryptedBody as `0x${string}`],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <>
      <div className="flex flex-col gap-4 w-1/2 justify-center mx-auto text-center">
        <h1 className="font-bold text-text1 text-4xl">Fulfil the order</h1>
        <p className="text-text2 text-sm">
          Submit the email body below to fulfil the order. The email will be
          encrypted with the buyers key so only they will be able to see the
          contents.
        </p>
        <textarea
          className="textarea h-96 resize-none flex-grow text-sm border rounded-lg border-primary1 p-2 bg-background1"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
        ></textarea>
        <div className="flex justify-center">
          <button onClick={fulfilOrder} className="btn  btn-primary">
            Encrypt & Fulfil Order
          </button>
        </div>
        <TransactionToast
          isConfirmed={isConfirmed}
          isConfirming={isConfirming}
          error={error}
          hash={hash}
        />
      </div>
    </>
  );
};

export default FulfilOrder;
