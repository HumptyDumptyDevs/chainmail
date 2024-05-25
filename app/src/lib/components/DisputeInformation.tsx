import React, { useEffect, useState } from "react";
import { decryptMessage } from "@/lib/utils/pgp";
import { convertHexToString } from "@/lib/utils/utils";
import { verifyEmailBodyHash } from "@/lib/utils/verifyHash";
import * as decode from "@/lib/utils/decodePublicSignals";
import ItemDetail from "./ItemDetail";

type DisputeInformationProps = {
  listing: ListingData;
  dispute: DisputeData;
};

const DecryptEmailBody = ({ listing, dispute }: DisputeInformationProps) => {
  const [decryptedEmailBody, setDecryptedEmailBody] = useState<string>("");
  const [bodyHash, setBodyHash] = useState<string>("");

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
      setBodyHash(listingBodyHash);
    } catch (error) {
      setBodyHash("Hash does not match");
      console.error(error);
    }
  };

  useEffect(() => {
    decryptEmailBody();
    verifyBodyHash();
  }, []);

  return (
    <div className="mt-10 flex flex-col justify-center">
      <h1 className="font-bold text-center text-text1 text-4xl">
        Dispute Information
      </h1>

      <div className="p-10 flex gap-20 justify-center">
        <div className="flex flex-col">
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
            <div className="flex items-center">
              <i className="fa-solid fa-right text-text2 text-4xl"></i>
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
        <div className="flex flex-col gap-8 mt-10">
          <ItemDetail title="Body Hash">{bodyHash}</ItemDetail>
          <ItemDetail title="Dispute Reason">{dispute.reason}</ItemDetail>
        </div>
      </div>
    </div>
  );
};

export default DecryptEmailBody;
