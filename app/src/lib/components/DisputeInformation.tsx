import React, { useEffect, useState } from "react";
import { decryptMessage } from "@/lib/utils/pgp";
import { convertHexToString } from "@/lib/utils/utils";
import { verifyEmailBodyHash } from "@/lib/utils/verifyHash";
import * as decode from "@/lib/utils/decodePublicSignals";

type DisputeInformationProps = {
  listing: ListingData;
  dispute: DisputeData;
};

const DecryptEmailBody = ({ listing, dispute }: DisputeInformationProps) => {
  const [decryptedEmailBody, setDecryptedEmailBody] = useState<string>("");
  const [calculatedBodyHash, setCalculatedBodyHash] = useState<string>("");

  const decryptEmailBody = async () => {
    const encryptedMailData = convertHexToString(
      listing.encryptedMailData as string
    );

    try {
      const decrypted = await decryptMessage(
        encryptedMailData,
        convertHexToString(dispute.buyersSecretPgpKey)
      );
      setDecryptedEmailBody(decrypted as string);
    } catch (error) {
      console.error(error);
      toast.error("Decryption failed");
    }
  };

  const verifyBodyHash = async () => {
    const listingBodyHash =
      decode.decimalToAscii(listing.proof.pubSignals[1].toString()) +
      decode.decimalToAscii(listing.proof.pubSignals[2].toString());

    try {
      const success = await verifyEmailBodyHash(
        decryptedEmailBody,
        listingBodyHash
      );
    } catch (error) {
      console.error(error);
    }

    setCalculatedBodyHash(listingBodyHash);
  };

  useEffect(() => {
    decryptEmailBody();
  }, []);

  return (
    <div className="p-10">
      <h1 className="font-bold text-center text-text1 text-4xl">
        Dispute Information
      </h1>
      <div className="flex w-full justify-center">
        <div className="p-5 flex gap-4 flex-col max-w-lg justify-center items-center">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-text1 text-lg text-center">
              Buyers Private Key
            </h2>
            <textarea
              className="min-w-64 text-sm h-64 border rounded-lg border-primary1 p-2 bg-background1 textarea textarea-lg "
              readOnly
              value={convertHexToString(dispute.buyersSecretPgpKey)}
            ></textarea>
          </div>
        </div>
        <div className="p-5 flex gap-4 flex-col max-w-lg justify-center items-center">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-text1 text-lg text-center">
              Decrypted Email
            </h2>
            <textarea
              className="min-w-64 h-64 text-sm border rounded-lg border-primary1 p-2 bg-background1 textarea textarea-lg "
              readOnly
              value={decryptedEmailBody}
            ></textarea>
          </div>
        </div>
      </div>
      <div
        className={` ${
          !!decryptedEmailBody ? "flex flex-col items-center" : "hidden"
        }  `}
      ></div>
    </div>
  );
};

export default DecryptEmailBody;
