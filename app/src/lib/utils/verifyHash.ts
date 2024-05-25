import crypto from "crypto";

function canonicalizeBody(body: string, bodyCanon: string) {
  if (bodyCanon === "relaxed") {
    body = body.replace(/\r?\n/g, "\r\n");
    // Remove trailing whitespace on each line and reduce spaces
    body = body
      .split("\r\n")
      .map((line) => line.replace(/\s+$/, "").replace(/\s+/g, " "))
      .join("\r\n");
    // Ensure the body ends with CRLF
    if (!body.endsWith("\r\n")) body += "\r\n";
  }
  return body;
}

function hashBody(body: string, hashAlgo: string) {
  const hash = crypto.createHash(hashAlgo);
  hash.update(body);
  return hash.digest("base64");
}

export async function verifyEmailBodyHash(
  rawBody: string,
  knownBodyHash: string
) {
  const bodyCanonicalizations = ["simple", "relaxed"];
  const hashAlgorithms = ["sha256", "sha1"];

  for (const bodyCanon of bodyCanonicalizations) {
    for (const hashAlgo of hashAlgorithms) {
      while (true) {
        const canonicalizedBody = canonicalizeBody(rawBody, bodyCanon);
        const bodyHash = hashBody(canonicalizedBody, hashAlgo);

        if (bodyHash === knownBodyHash) {
          return true;
        }

        // Remove one trailing newline at a time
        const trimmedBody = rawBody.replace(/\r?\n$/, "");
        if (trimmedBody === rawBody) {
          break; // No more newlines to remove, exit the loop
        }
        rawBody = trimmedBody;
      }
    }
  }
  console.log("No match found");
  throw new Error("No match found");
}
