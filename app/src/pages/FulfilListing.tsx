import { useEffect, useState } from "react";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { FulfilOrder } from "@/lib/components";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function FulfilListing() {
  const navigate = useNavigate();
  const params = useParams();
  const chainmail = useChainmail();
  const [listing, setListing] = useState<ListingData | undefined>(undefined);

  useEffect(() => {
    console.log(chainmail?.activeListings);
    const foundListing = chainmail?.activeListings?.find(
      (listing) => `${listing.id}` === params.id
    );
    setListing(foundListing); // Set the found listing as state
  }, [chainmail?.activeListings, params.id]);

  if (chainmail?.listingsLoading) {
    return (
      <div className="text-xl flex justify-center items-center text-text-2 h-96">
        Loading...
      </div>
    );
  }

  if (!listing) {
    navigate("/my-listings");
  }

  return (
    <>
      {listing && (
        <div className="p-10">
          <FulfilOrder listing={listing} />
        </div>
      )}
    </>
  );
}
