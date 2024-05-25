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

const ViewDispute = () => {
  const params = useParams();
  const chainmail = useChainmail();
  const [listing, setListing] = useState<ListingData | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const foundListing = chainmail?.activeListings?.find(
      (listing) => `${listing.id}` === params.id
    );
    setListing(foundListing); // Set the found listing as state
  }, [chainmail?.activeListings, params.id]);

  return (
    listing && ( // If listing is not undefined
      <div>
        <ListingInformation listing={listing} />
        <DecryptEmailBody listing={listing} pgpPrivateKey />
      </div>
    )
  );
};

export default ViewDispute;
