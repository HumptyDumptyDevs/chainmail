import { ethers } from "ethers";

export const convertStringToHex = (str: string) => {
  if (!str) return "";
  const bytes = ethers.utils.toUtf8Bytes(str);
  const hex = ethers.utils.hexlify(bytes);
  return hex;
};

export const convertHexToString = (hex: string) => {
  if (!hex) return "";
  const bytes = ethers.utils.arrayify(hex);
  const str = ethers.utils.toUtf8String(bytes);
  return str;
};

export function isBrowser() {
  return typeof window !== "undefined";
}

export async function downloadWithRetries(
  link: string,
  downloadAttempts: number
) {
  for (let i = 1; i <= downloadAttempts; i++) {
    console.log(`Download attempt ${i} for ${link}`);
    const response = await fetch(link, { method: "GET" });
    if (response.status === 200) {
      console.log(`Successfully downloaded ${link}`);
      return response;
    }
    console.warn(`Download attempt ${i} failed for ${link}`);
  }
  throw new Error(
    `Error downloading ${link} after ${downloadAttempts} retries`
  );
}

export function extractEmailBody(emailContent: string) {
  const lines = emailContent.split(/\r?\n/);
  const emptyLineIndex = lines.indexOf("");
  if (emptyLineIndex !== -1) {
    return lines.slice(emptyLineIndex + 1).join("\r\n");
  }
  return "";
}

export function extractDKIMHeaderBodyHash(email: string) {
  const dkimHeaderIndex = email.indexOf("DKIM-Signature:");
  if (dkimHeaderIndex === -1) {
    throw new Error("No DKIM signature found in the email");
  }

  const bhIndex = email.indexOf("bh=", dkimHeaderIndex);
  if (bhIndex === -1) {
    throw new Error("No body hash found in the DKIM signature");
  }

  const bodyHash = email.slice(bhIndex + 3, email.indexOf(";", bhIndex));

  return bodyHash;
}

export const mapListingStatus = (status: number) => {
  switch (status) {
    case 0:
      return "Active";
    case 1:
      return "Pending-Delivery";
    case 2:
      return "Fulfilled";
    case 3:
      return "Completed";
    case 4:
      return "Disputed";
    default:
      return "Unknown";
  }
};
