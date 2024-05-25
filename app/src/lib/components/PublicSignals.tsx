import { useEffect, useState } from "react";
import * as decode from "@/lib/utils/decodePublicSignals";

type PublicSignalsProps = {
  pubSignals: Proof["pubSignals"] | undefined;
};

type DecodedPublicSignalsKey =
  | "emailHash"
  | "emailFrom"
  | "emailPublicKey"
  | "address";

const labels = {
  emailHash: "Email Body Hash",
  emailFrom: "Email From",
  emailPublicKey: "Public Key of Signing",
  address: "Owners Address",
};

const PublicSignals = ({ pubSignals }: PublicSignalsProps) => {
  const [decodedPublicSignals, setDecodedPublicSignals] =
    useState<DecodedPublicSignals>({
      emailHash: "",
      emailFrom: "",
      emailPublicKey: "",
      address: "0x",
    });

  useEffect(() => {
    if (pubSignals) {
      setDecodedPublicSignals({
        emailHash:
          decode.decimalToAscii(pubSignals[1].toString()) +
          decode.decimalToAscii(pubSignals[2].toString()),
        emailFrom: decode.decimalToAscii(pubSignals[3].toString()),
        emailPublicKey: pubSignals[0].toString(),
        address: decode.decimalToEthereumAddress(pubSignals[4].toString()),
      });
    } else {
      setDecodedPublicSignals({
        emailHash: "",
        emailFrom: "",
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
