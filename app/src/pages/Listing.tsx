import { useEffect, useState } from "react";
import { useChainmail } from "@/lib/context/ChainmailContext";
import { BuyEmail, GeneratePgpKey, ListingInformation } from "@/lib/components";
import { useParams } from "react-router-dom";

export default function Listing() {
  const params = useParams();
  const chainmail = useChainmail();
  const [listing, setListing] = useState<ListingData | undefined>(undefined);
  const [keys, setKeys] = useState<PGPKeyPair>({
    privateKey: "",
    publicKey: "",
  });

  useEffect(() => {
    console.log(chainmail?.activeListings);
    const foundListing = chainmail?.activeListings?.find(
      (listing) => `${listing.id}` === params.id
    );
    setListing(foundListing); // Set the found listing as state
  }, [chainmail?.activeListings, params.id]);

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 flex flex-col gap-10">
      <ListingInformation listing={listing} />
      <GeneratePgpKey
        listingId={Number(listing.id)}
        keys={keys}
        setKeys={setKeys}
      />
      <BuyEmail
        listingId={listing.id}
        listingPrice={listing.price}
        pgpPublicKey={keys.publicKey}
      />
    </div>
  );
}
