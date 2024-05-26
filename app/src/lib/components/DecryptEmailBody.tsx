import React, { useEffect, useState } from "react";
import { decryptMessage } from "@/lib/utils/pgp";
import { convertHexToString } from "@/lib/utils/utils";
import { verifyEmailBodyHash } from "@/lib/utils/verifyHash";
import * as decode from "@/lib/utils/decodePublicSignals";
import { ToastContainer, toast } from "react-toastify";

type DecryptEmailBodyProps = {
  listing: ListingData;
  pgpPrivateKey: string;
};

const DecryptEmailBody = ({
  listing,
  pgpPrivateKey,
}: DecryptEmailBodyProps) => {
  const [privateKey, setPrivateKey] = useState<string>(pgpPrivateKey);
  const [decryptedEmailBody, setDecryptedEmailBody] = useState<string>("");
  const [calculatedBodyHash, setCalculatedBodyHash] = useState<string>("");

  const onPrivateKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrivateKey(e.target.value);
  };

  const decryptEmailBody = async () => {
    const encryptedMailData = convertHexToString(
      listing.encryptedMailData as string
    );

    try {
      const decrypted = await decryptMessage(encryptedMailData, privateKey);

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

      if (success) {
        toast.success("Body hash matches");
      } else {
        toast.error("Body hash does not match");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error verifying body hash");
    }

    setCalculatedBodyHash(listingBodyHash);
  };

  return (
    <div className="p-10">
      <h1 className="font-bold text-center text-text1 text-4xl">
        Decrypt your email
      </h1>
      <div className="flex w-full justify-center">
        <div className="p-5 flex gap-4 flex-col max-w-lg justify-center items-center">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-text1 text-lg text-center">
              Private Key
            </h2>
            <textarea
              className="min-w-64 text-sm h-64 border rounded-lg border-primary1 p-2 bg-background1 textarea textarea-lg "
              value={privateKey}
              onChange={onPrivateKeyChange}
            ></textarea>
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={decryptEmailBody} className="btn btn-primary">
            Decrypt
          </button>
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
      >
        <button onClick={verifyBodyHash} className="btn btn-primary mt-10">
          Verify Body Hash
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DecryptEmailBody;
