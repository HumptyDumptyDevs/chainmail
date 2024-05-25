import { useEffect, useState } from "react";
import { useChainmail } from "@/lib/context/ChainmailContext";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { abi } from "@/lib/abi/abiChainmail";
import { ethers } from "ethers";

type AddListingProps = {
  proof: Proof | undefined;
  emailBody: string;
};

type NewListingData = {
  description: string;
  price: string;
};

const AddListing = ({ proof, emailBody }: AddListingProps) => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const chainmail = useChainmail();
  const [newListingData, setNewListingData] = useState<NewListingData>({
    description: "",
    price: "",
  });

  const addListing = async () => {
    if (!proof) return;

    const priceInWei = ethers.utils.parseEther(newListingData.price).toBigInt();

    console.log(
      `calling  the address ${
        import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS
      } createListing with ${proof}, ${
        newListingData.description
      }, ${priceInWei}`
    );

    writeContract({
      address: import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "createListing",
      args: [proof, newListingData.description, priceInWei],
      value: chainmail?.stakeOfAuthenticity,
    });
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      console.log("Transaction confirmed");

      // Retrieve existing data or initialize an empty object
      let emailBodyMap = JSON.parse(
        localStorage.getItem("emailBodyMap") || "{}"
      );

      const listingId = chainmail?.ownersListings?.slice(-1)[0].id.toString();

      // Update or add the email body for the current listing ID
      emailBodyMap[listingId!] = emailBody;

      console.log(`Email body map: ${emailBodyMap}`);

      // Store the updated map in localStorage
      localStorage.setItem("emailBodyMap", JSON.stringify(emailBodyMap));
    } else if (isError) {
      console.log("Error", isError);
    } else if (error) {
      console.log("Error", error);
    }
  }, [isConfirmed, isError, error]);

  return (
    <div className="p-10 border border-primary1 bg-background3 shadow-xl rounded-lg w-96">
      <h1 className="text-2xl font-bold text-text2">Create Listing</h1>
      <div className="flex flex-col justify-center gap-4 mt-4">
        <div>
          <h4 className="w-60 text-sm font-bold whitespace-nowrap">
            Description
          </h4>
          <p className="italic text-xs">
            Describe the kind of email you are listing. This will be public.
          </p>
          <textarea
            value={newListingData.description}
            onChange={(e) => {
              setNewListingData({
                ...newListingData,
                description: e.target.value,
              });
            }}
            className="textarea textarea-lg text-xs resize-none w-full h-40  border rounded-lg border-primary1 p-2 bg-background1"
          ></textarea>
        </div>
        <div>
          <h4 className="w-60 text-sm font-bold whitespace-nowrap">Price</h4>
          <label className="border rounded-lg border-primary1 p-2 bg-background1 flex items-center gap-2">
            Ξ
            <input
              type="text"
              className="grow bg-background1 focus:outline-none"
              onChange={(e) => {
                setNewListingData({
                  ...newListingData,
                  price: e.target.value,
                });
              }}
              value={newListingData.price}
            />
          </label>
        </div>
        <button onClick={addListing} className="btn btn-primary">
          Add Listing
        </button>
        <div className="break-all">
          {hash && <div>Transaction Hash: {hash}</div>}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
          {error && (
            <div>
              Error: {(error as BaseError).shortMessage || error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddListing;
