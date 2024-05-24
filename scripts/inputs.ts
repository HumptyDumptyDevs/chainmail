import { bytesToBigInt, fromHex } from "@zk-email/helpers/";
import { generateEmailVerifierInputsFromDKIMResult } from "@zk-email/helpers";
import {
  verifyDKIMSignature,
  DKIMVerificationResult,
} from "@zk-email/helpers/dist/dkim";
import fs from "fs";
import path from "path";

export type IMailSaleCircuitInputs = {
  fromEmailIndex: string;
  address: string;
  emailHeader: string[];
  emailHeaderLength: string;
  pubkey: string[];
  signature: string[];
  emailBody?: string[] | undefined;
  emailBodyLength?: string | undefined;
  precomputedSHA?: string[] | undefined;
  bodyHashIndex?: string | undefined;
};

type InputGenerationArgs = {
  ignoreBodyHashCheck?: boolean;
  shaPrecomputeSelector?: string;
  maxHeadersLength?: number; // Max length of the email header including padding
  maxBodyLength?: number; // Max length of the email body after shaPrecomputeSelector including padding
};

function charArrayToString(charArray: any) {
  return String.fromCharCode(...charArray);
}

export async function generateEmailVerifierInputs(
  rawEmail: Buffer | string,
  params: InputGenerationArgs = {}
) {
  const dkimResult = await verifyDKIMSignature(rawEmail);

  const emailVerifierInputs = generateEmailVerifierInputsFromDKIMResult(
    dkimResult,
    {
      ignoreBodyHashCheck: true,
      maxHeadersLength: 1024,
    }
  );

  return emailVerifierInputs;
}

export async function generateExampleVerifierCircuitInputs(
  email: string | Buffer,
  ethereumAddress: string
): Promise<IMailSaleCircuitInputs> {
  const emailVerifierInputs = await generateEmailVerifierInputs(email);

  //Get the from email index
  const fromIndex = charArrayToString(emailVerifierInputs.emailHeader).indexOf(
    "from:"
  );

  const bodyHashIndex =
    charArrayToString(emailVerifierInputs.emailHeader).indexOf("bh=") + 3;

  const fromEmailIndex =
    charArrayToString(emailVerifierInputs.emailHeader).indexOf("<", fromIndex) +
    1;

  console.log("From Email Index:", fromEmailIndex);

  console.log(charArrayToString(emailVerifierInputs.emailHeader));

  const address = bytesToBigInt(fromHex(ethereumAddress)).toString();

  return {
    ...emailVerifierInputs,
    fromEmailIndex: fromEmailIndex.toString(),
    bodyHashIndex: bodyHashIndex.toString(),
    address,
  };
}

(async () => {
  const rawEmail = fs.readFileSync(
    path.join(__dirname, "../emls/SatoshiNakamoto.eml"),
    "utf-8"
  );

  const ethereumAddress = "0xaf624715303fcdec70e915B6E8c102428f657560";

  //   console.log(rawEmail);

  const circuitInputs = await generateExampleVerifierCircuitInputs(
    Buffer.from(rawEmail),
    ethereumAddress
  );
  //   console.log("\n\nGenerated Inputs:", circuitInputs, "\n\n");
  const headerString = charArrayToString(circuitInputs.emailHeader);
  console.log("Header:", headerString);
  const from = "from:";
  console.log("body hash index:", circuitInputs.bodyHashIndex);
  fs.writeFileSync(
    path.join(__dirname, "input.json"),
    JSON.stringify(circuitInputs, null, 2)
  );
  console.log("Inputs written to", path.join(__dirname, "input.json"));
})();
