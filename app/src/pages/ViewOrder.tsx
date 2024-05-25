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

const ViewOrder = () => {
  const params = useParams();
  const chainmail = useChainmail();
  const [listing, setListing] = useState<ListingData | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const foundListing = chainmail?.buyersListings?.find(
      (listing) => `${listing.id}` === params.id
    );
    setListing(foundListing); // Set the found listing as state
  }, [chainmail?.buyersListings, params.id]);

  return (
    listing && ( // If listing is not undefined
      <div>
        <ListingInformation listing={listing} />
        {listing.status === 2 && <DecryptEmailBody listing={listing} />}
        <div className="flex justify-center mb-10">
          <button className="btn btn-error" onClick={() => setIsOpen(true)}>
            Open dispute
          </button>
        </div>
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
              <div className="flex gap-4">
                <button
                  className="btn btn-outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Open
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    )
  );
};

export default ViewOrder;
