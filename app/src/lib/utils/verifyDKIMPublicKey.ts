import { buildPoseidon } from "circomlibjs";
import { decode } from "base64-arraybuffer";

// Convert to big integers (using chunks as expected by the circom circuit)
const numChunks = 17; // k in the circuit
const chunkSize = 121; // n in the circuit

const publicKey =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAntvSKT1hkqhKe0xcaZ0x+QbouDsJuBfby/S82jxsoC/SodmfmVs2D1KAH3mi1AqdMdU12h2VfETeOJkgGYq5ljd996AJ7ud2SyOLQmlhaNHH7Lx+Mdab8/zDN1SdxPARDgcM7AsRECHwQ15R20FaKUABGu4NTbR2fDKnYwiq5jQyBkLWP+LgGOgfUF4T4HZb2PY2bQtEP6QeqOtcW4rrsH24L7XhD+HSZb1hsitrE0VPbhJzxDwI4JF815XMnSVjZgYUXP8CxI1Y0FONlqtQYgsorZ9apoW1KPQe8brSSlRsi9sXB/tu56LmG7tEDNmrZ5XUwQYUUADBOu7t1niwXwIDAQAB";

const formatPublicKeyForPoseidon = (publicKey: string) => {
  const decodedKey = new Uint8Array(decode(publicKey));
  const chunks = [];
  for (let i = 0; i < numChunks; i++) {
    let chunk = BigInt(0);
    for (let j = 0; j < chunkSize; j++) {
      const index = i * chunkSize + j;
      const byte = index < decodedKey.length ? decodedKey[index] : 0;
      chunk = (chunk << 8n) + BigInt(byte);
    }
    chunks.push(chunk);
  }

  // Format chunks into Poseidon inputs
  const poseidonInputs = [];
  for (let i = 0; i < Math.ceil(chunks.length / 2); i++) {
    if (i * 2 + 1 < chunks.length) {
      const combinedChunk =
        chunks[i * 2] + (1n << BigInt(chunkSize * 8)) * chunks[i * 2 + 1];
      poseidonInputs.push(combinedChunk);
    } else {
      poseidonInputs.push(chunks[i * 2]);
    }
  }
  return poseidonInputs;
};

const uint8ArrayToBigInt = (uint8Array: Uint8Array) => {
  let result = BigInt(0);
  for (let i = 0; i < uint8Array.length; i++) {
    result = (result << 8n) + BigInt(uint8Array[i]);
  }
  return result;
};

export const verifyDKIMPublicKey = async () => {
  let poseidon = await buildPoseidon();
  const poseidonInputs = formatPublicKeyForPoseidon(publicKey);
  const hash = poseidon(poseidonInputs);
  console.log(hash);
  //convert hash to decimal
  const hashBigInt = uint8ArrayToBigInt(new Uint8Array(hash));
  console.log(hashBigInt);
  return hash;
};
