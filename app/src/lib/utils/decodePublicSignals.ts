import bigInt from "big-integer";

// Convert decimal string to a Base64 string
export function decodeBase64FromDecimal(decimalString: string): string {
  let hexString = bigInt(decimalString).toString(16);
  const buffer = Buffer.from(hexString, "hex");
  return buffer.toString("base64");
}

// Convert decimal string to an ASCII string
export function decimalToAscii(decimalString: string): string {
  const outputHex = bigInt(decimalString).toString(16);
  let result = Buffer.from(outputHex, "hex").toString();
  return result.split("").reverse().join("");
}

// Convert decimal string to an Ethereum address format
export function decimalToEthereumAddress(decimalString: string): `0x${string}` {
  const hexString = bigInt(decimalString).toString(16).padStart(40, "0");
  return `0x${hexString}`;
}
