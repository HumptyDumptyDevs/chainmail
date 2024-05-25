import { DecryptEmailBody, ListingInformation } from "@/lib/components";
import { useChainmail } from "@/lib/context/ChainmailContext";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { abi } from "@/lib/abi/abiChainmail";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { convertStringToHex } from "@/lib/utils/utils";
import { useNavigate } from "react-router-dom";

const ViewOrder = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const chainmail = useChainmail();
  const [listing, setListing] = useState<ListingData | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string>("");
  const [disputeDescription, setDisputeDescription] = useState<string>("");

  const openDispute = async () => {
    if (!listing) return;

    //convert the pgpPrivateKey to hex
    const pgpPrivateKeyHex = convertStringToHex(pgpPrivateKey);

    console.log(`Disputing listing ${listing.id}`);
    console.log(
      `With address ${import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS}`
    );
    console.log(`With pgpPrivateKey ${pgpPrivateKeyHex}`);

    writeContract({
      address: import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "dispute",
      args: [listing.id, pgpPrivateKeyHex as `0x${string}`, disputeDescription],
    });
  };

  useEffect(() => {
    const foundListing = chainmail?.buyersListings?.find(
      (listing) => `${listing.id}` === params.id
    );
    setListing(foundListing); // Set the found listing as state

    const pgpKeyPairMap = localStorage.getItem("pgpKeyPairMap") || "{}";

    if (foundListing) {
      const pgpKeyPair = JSON.parse(pgpKeyPairMap)[Number(foundListing.id)];
      if (pgpKeyPair) {
        setPgpPrivateKey(pgpKeyPair.privateKey);
      }
    }
  }, [chainmail?.buyersListings, params.id]);

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      setIsOpen(false);
    }
  }, [isConfirmed]);

  return (
    listing && ( // If listing is not undefined
      <div>
        <ListingInformation listing={listing} />
        {listing.status === 2 ? (
          <>
            <DecryptEmailBody listing={listing} pgpPrivateKey={pgpPrivateKey} />
            <div className="flex justify-center mb-10">
              <button className="btn btn-error" onClick={() => setIsOpen(true)}>
                Open dispute
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col mt-10 gap-10 items-center">
            <div className="text-center text-text-2 font-bold text-2xl">
              This order is being disputed.
            </div>
            <button
              className="btn btn-primary    w-fit"
              onClick={() => navigate(`/disputes/${listing.id}`)}
            >
              View dispute
            </button>
          </div>
        )}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-background3 p-12">
              <DialogTitle className="font-bold">Open Dispute</DialogTitle>

              <p>
                Are you sure you want to open a dispute? If you lose the dispute
                you will forfeit your stake of authenticity.
              </p>
              <textarea
                className="w-full h-32 border rounded-lg border-primary1 p-2 bg-background1 textarea textarea-lg"
                placeholder="Enter the reason for the dispute."
                value={disputeDescription}
                onChange={(e) => setDisputeDescription(e.target.value)}
              ></textarea>
              <div className="flex gap-4">
                <button
                  className="btn btn-outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={openDispute}>
                  Open
                </button>
                <div className="break-all">
                  {hash && <div>Transaction Hash: {hash}</div>}
                  {isConfirming && <div>Waiting for confirmation...</div>}
                  {isConfirmed && <div>Transaction confirmed.</div>}
                  {error && (
                    <div>
                      Error:{" "}
                      {(error as BaseError).shortMessage || error.message}
                    </div>
                  )}
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    )
  );
};

export default ViewOrder;
