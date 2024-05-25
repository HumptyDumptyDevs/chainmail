import { useEffect } from "react";
import { useAccount } from "wagmi";
import { generateKeyPair } from "@/lib/utils/pgp";

type GeneratePgpKeyProps = {
  keys: PGPKeyPair;
  setKeys: (keys: PGPKeyPair) => void;
};

const GeneratePgpKey = ({ keys, setKeys }: GeneratePgpKeyProps) => {
  const pgpKeyPair = localStorage.getItem("pgpKeyPair");
  const account = useAccount();

  useEffect(() => {
    generatePgpKey();
  }, []);

  const generatePgpKey = async () => {
    if (pgpKeyPair) {
      const keys = JSON.parse(pgpKeyPair);
      console.log("Setting keys from storage");
      setKeys(keys);
      return;
    }

    const { privateKey, publicKey } = await generateKeyPair(
      account?.address || ""
    );

    localStorage.setItem(
      "pgpKeyPair",
      JSON.stringify({ privateKey, publicKey })
    );

    setKeys({ privateKey, publicKey });
  };

  return (
    <div className="p-5 flex gap-4 flex-col max-w-lg justify-center items-center mx-auto text-center">
      <h1 className="font-bold text-text1 text-4xl">PGP Key</h1>
      <p className="text-text2 text-sm">
        Here is the PGP key that you will need to purchase the email
      </p>
      <p className="text-text2 text-sm">
        The seller will use the public key to encrypt the email so it is
        important you save the private key so you can decrypt your purchase
      </p>
      <div className="flex gap-4 w-full justify-center">
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="font-bold text-text1 text-lg text-center">
            Private Key
          </h2>
          <div className="h-64 text-xs text-text1 border rounded-lg border-primary1 p-2 bg-background1">
            <pre>{keys?.privateKey}</pre>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <h2 className="font-bold text-text1 text-lg text-center">
            Public Key
          </h2>
          <div className="h-64 text-text1 text-xs border rounded-lg border-primary1 p-2 bg-background1">
            <pre>{keys?.publicKey}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePgpKey;
