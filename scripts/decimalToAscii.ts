function decimalToAscii(decimalString: string): string {
  const outputHex = BigInt(decimalString).toString(16);
  let result = Buffer.from(outputHex, "hex").toString();
  return result.split("").reverse().join("");
}

console.log(decimalToAscii("148148873981201281813561602926187929939"));
