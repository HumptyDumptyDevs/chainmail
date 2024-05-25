import { formatEther } from "viem";
import ItemDetail from "@/components/ItemDetail";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import * as decode from "@/lib/utils/decodePublicSignals";
import { mapListingStatus } from "../utils/utils";
import { useState } from "react";
import VerifyProof from "./VerifyProof";

type ListingInformationProps = {
  listing: ListingData;
};

function ListingInformation({ listing }: ListingInformationProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Custom replacer function to handle BigInt serialization
  const bigintReplacer = (key: string, value: any) => {
    return typeof value === "bigint" ? value.toString() : value;
  };

  return (
    <>
      <div className="px-32">
        <h1 className="text-2xl font-bold text-text2 mb-4">Listing Details</h1>
        <div className="flex justify-center p-10 border border-primary1 bg-background3 shadow-xl rounded-lg">
          <div className="w-1/2 flex flex-col gap-4">
            <ItemDetail title="Email From">
              {decode.decimalToAscii(listing.proof.pubSignals[3].toString())}
            </ItemDetail>
            <ItemDetail title="Description">{listing.description}</ItemDetail>
            <ItemDetail title="Email Hash">
              {decode.decimalToAscii(listing.proof.pubSignals[1].toString()) +
                decode.decimalToAscii(listing.proof.pubSignals[2].toString())}
            </ItemDetail>
            <ItemDetail title="Price">
              {formatEther(listing.price)} Ξ
            </ItemDetail>
            <ItemDetail title="Status">
              {mapListingStatus(listing.status)}
            </ItemDetail>
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            <ItemDetail title="Owner">
              {listing.owner.slice(0, 10) +
                "    ...    " +
                listing.owner.slice(-10)}
            </ItemDetail>
            <div className="h-full  flex items-center justify-center">
              <button
                className="btn btn-secondary"
                onClick={() => setIsOpen(true)}
              >
                View Proof
              </button>
            </div>

            <Dialog
              open={isOpen}
              onClose={() => setIsOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-background3 p-12">
                  <DialogTitle className="font-bold">Proof data</DialogTitle>
                  <Description>
                    <div className="border flex-grow rounded-lg border-primary1 p-2 bg-background1 mb-4 overflow-y-auto">
                      <pre className="text-xs">
                        {JSON.stringify(listing.proof, bigintReplacer, 2)}
                      </pre>
                    </div>
                    <div className="flex justify-between">
                      <button
                        className="btn btn-outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Close
                      </button>
                      <div>
                        <VerifyProof proof={listing.proof} />
                      </div>
                    </div>
                  </Description>
                </DialogPanel>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListingInformation;
