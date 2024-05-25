import { bytesToBigInt, fromHex } from "@zk-email/helpers";
import { generateEmailVerifierInputsFromDKIMResult } from "@zk-email/helpers";
import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim/index";

export type IMailSaleCircuitInputs = {
  fromEmailIndex: string;
  subjectIndex: string;
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

export async function generateEmailVerifierInputs(rawEmail: Buffer | string) {
  const dkimResult = await verifyDKIMSignature(rawEmail, "", true);
  const emailVerifierInputs = generateEmailVerifierInputsFromDKIMResult(
    dkimResult,
    {
      ignoreBodyHashCheck: true,
    }
  );

  return emailVerifierInputs;
}

export async function genRawInputs(
  email: string,
  ethereumAddress: string
): Promise<IMailSaleCircuitInputs> {
  const emailVerifierInputs = await generateEmailVerifierInputs(email);

  //Get the from email index
  const fromIndex = charArrayToString(emailVerifierInputs.emailHeader).indexOf(
    "from:"
  );

  const rawSubjectIndex = charArrayToString(
    emailVerifierInputs.emailHeader
  ).indexOf("subject:");

  const bodyHashIndex =
    charArrayToString(emailVerifierInputs.emailHeader).indexOf("bh=") + 3;

  console.log("Body Hash Index:", bodyHashIndex);

  //Log from the body hash index
  console.log(
    charArrayToString(emailVerifierInputs.emailHeader).slice(
      bodyHashIndex,
      bodyHashIndex + 100
    )
  );
  const fromEmailIndex =
    charArrayToString(emailVerifierInputs.emailHeader).indexOf("<", fromIndex) +
    1;

  console.log("From Email Index:", fromEmailIndex);

  const subjectIndex =
    charArrayToString(emailVerifierInputs.emailHeader).indexOf(
      ":",
      rawSubjectIndex
    ) + 1;

  console.log("Subject Index:", subjectIndex);

  console.log(
    charArrayToString(emailVerifierInputs.emailHeader).slice(
      fromEmailIndex,
      fromEmailIndex + 100
    )
  );

  console.log(charArrayToString(emailVerifierInputs.emailHeader));

  const address = bytesToBigInt(fromHex(ethereumAddress)).toString();

  return {
    ...emailVerifierInputs,
    fromEmailIndex: fromEmailIndex.toString(),
    subjectIndex: subjectIndex.toString(),
    bodyHashIndex: bodyHashIndex.toString(),
    address,
  };
}

export const generateCircuitInputs = async (
  ethereumAddress: `0x${string}`,
  rawEmail: string
) => {
  console.log("Generating circuit inputs");
  console.log(ethereumAddress, rawEmail);
  const rawInputs = await genRawInputs(rawEmail, ethereumAddress);

  const circuitInputs = {
    fromEmailIndex: rawInputs.fromEmailIndex,
    subjectIndex: rawInputs.subjectIndex,
    address: rawInputs.address,
    emailHeader: rawInputs.emailHeader,
    emailHeaderLength: rawInputs.emailHeaderLength,
    pubkey: rawInputs.pubkey,
    signature: rawInputs.signature,
    bodyHashIndex: rawInputs.bodyHashIndex,
  };

  console.log(circuitInputs);

  return circuitInputs;
};
