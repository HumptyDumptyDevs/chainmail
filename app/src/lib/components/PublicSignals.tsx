import { useEffect, useState } from "react";
import * as decode from "@/lib/utils/decodePublicSignals";
import { verifyEmailBodyHash } from "../utils/verifyHash";

type PublicSignalsProps = {
  pubSignals: Proof["pubSignals"] | undefined;
};

type DecodedPublicSignalsKey =
  | "emailHash"
  | "emailFrom"
  | "emailSubject"
  | "emailPublicKey"
  | "address";

const labels = {
  emailHash: "Email Body Hash",
  emailFrom: "Email From",
  emailSubject: "Email Subject",
  emailPublicKey: "Public Key of Signing",
  address: "Owners Address",
};

const PublicSignals = ({ pubSignals }: PublicSignalsProps) => {
  const [decodedPublicSignals, setDecodedPublicSignals] =
    useState<DecodedPublicSignals>({
      emailHash: "",
      emailFrom: "",
      emailSubject: "",
      emailPublicKey: "",
      address: "0x",
    });

  useEffect(() => {
    if (pubSignals) {
      setDecodedPublicSignals({
        emailFrom: decode.decimalToAscii(pubSignals[3].toString()),
        emailSubject: decode.decimalToAscii(pubSignals[4].toString()),
        emailHash:
          decode.decimalToAscii(pubSignals[1].toString()) +
          decode.decimalToAscii(pubSignals[2].toString()),
        emailPublicKey: pubSignals[0].toString(),
        address: decode.decimalToEthereumAddress(pubSignals[5].toString()),
      });
    } else {
      setDecodedPublicSignals({
        emailHash: "",
        emailFrom: "",
        emailSubject: "",
        emailPublicKey: "",
        address: "0x",
      });
    }
  }, [pubSignals]);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-bold text-text2">Decoded Public Signals</h1>
      {Object.entries(decodedPublicSignals).map(([key, value]) => (
        <div key={key} className="flex flex-col justify-center">
          <h4 className="w-60 text-sm font-bold whitespace-nowrap">
            {labels[key as DecodedPublicSignalsKey]}:
          </h4>
          <div className="input input-bordered w-full text-xs h-fit border rounded-lg border-primary1 p-2 bg-background1 break-all">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicSignals;
