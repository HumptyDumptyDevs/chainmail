import { useEffect } from "react";
import { useAccount } from "wagmi";
import { generateKeyPair } from "@/lib/utils/pgp";

type GeneratePgpKeyProps = {
  listingId: number;
  keys: PGPKeyPair;
  setKeys: (keys: PGPKeyPair) => void;
};

const GeneratePgpKey = ({ listingId, keys, setKeys }: GeneratePgpKeyProps) => {
  // const pgpKeyPair = localStorage.getItem("pgpKeyPair");

  // Retrieve existing key pair map or initialize an empty object
  let pgpKeyPairMap = JSON.parse(localStorage.getItem("pgpKeyPairMap") || "{}");
  const account = useAccount();

  useEffect(() => {
    generatePgpKey();
  }, []);

  const generatePgpKey = async () => {
    console.log("Generating PGP key");
    console.log(pgpKeyPairMap);
    if (pgpKeyPairMap.hasOwnProperty(listingId)) {
      console.log(`Listing ID ${listingId} found.`);
      let pgpKeyPair = pgpKeyPairMap[listingId];
      console.log(pgpKeyPair);
      console.log("Setting keys from storage");
      console.log(keys);
      setKeys(keys);
      return;
    }

    if (!pgpKeyPairMap.hasOwnProperty(listingId)) {
      console.log(`Listing ID ${listingId} not found.`);
      const { privateKey, publicKey } = await generateKeyPair(
        account?.address || ""
      );

      console.log("Setting keys from generated key pair");

      // Create a new map with the existing pairs AND the new one
      const updatedPgpKeyPairMap = {
        ...pgpKeyPairMap, // Spread existing key pairs
        [listingId]: { privateKey, publicKey },
      };

      console.log(updatedPgpKeyPairMap);

      localStorage.setItem(
        "pgpKeyPairMap",
        JSON.stringify(updatedPgpKeyPairMap)
      ); // Store entire map

      setKeys({ privateKey, publicKey });
    }
  };

  return (
    <div className="p-5 flex gap-4 flex-col max-w-2xl justify-center items-center mx-auto text-center">
      <h1 className="font-bold text-text1 text-4xl">PGP Key</h1>
      <p className="text-text2 text-sm">
        Here is the PGP key that you will need to purchase the email
      </p>
      <p className="text-text2 text-sm font-extrabold">
        The seller will use the public key to encrypt the email so it is
        important you save the private key so you can decrypt your purchase
      </p>
      <div className="flex gap-4 w-full justify-center">
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="font-bold text-text1 text-lg text-left">
            Private Key
          </h2>
          <div className="h-64 text-xs text-text1 text-left border rounded-lg border-primary1 p-2 bg-background1">
            <pre>{keys?.privateKey}</pre>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <h2 className="font-bold text-text1 text-lg text-left">Public Key</h2>
          <div className="h-64 text-text1 text-xs text-left border rounded-lg border-primary1 p-2 bg-background1">
            <pre>{keys?.publicKey}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePgpKey;
