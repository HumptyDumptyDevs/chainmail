import localforage from "localforage";
import * as snarkjs from "snarkjs";
import { downloadWithRetries } from "@/lib/utils/utils";

const CIRCUIT_NAME = "chainmail";
const zkeySuffix = ["b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

// We can use this function to ensure the type stored in localforage is correct.
async function storeArrayBuffer(keyname: string, buffer: ArrayBuffer) {
  console.log(`Storing ${keyname} in localforage`);
  return localforage.setItem(keyname, buffer);
}

// GET the compressed file from the remote server, then store it with localforage
// Note that it must be stored as an uncompressed ArrayBuffer
// and named such that filename === `${name}.zkey${a}` in order for it to be found by snarkjs.
export async function downloadFromFilename(baseUrl: string, filename: string) {
  const link = baseUrl + filename;

  const zkeyResp = await downloadWithRetries(link, 3);

  const zkeyBuff = await zkeyResp.arrayBuffer();
  console.log(`Downloaded data for ${filename}:`, zkeyBuff);

  await storeArrayBuffer(filename, zkeyBuff);

  console.log(`Storage of ${filename} successful!`);
}

export async function downloadProofFiles(
  baseUrl: string,
  circuitName: string,
  onFileDownloaded: () => void
) {
  const filePromises = [];
  for (const c of zkeySuffix) {
    // const targzFilename = `${circuitName}.zkey${c}${zkeyExtension}`;
    const targzFilename = `${circuitName}.zkey${c}`;
    const item = await localforage.getItem(`${circuitName}.zkey${c}`);
    if (item) {
      console.log(
        `${circuitName}.zkey${c}${item} already found in localforage!`
      );
      onFileDownloaded();
      continue;
    }
    filePromises.push(
      downloadFromFilename(baseUrl, targzFilename)
        .then(() => {
          onFileDownloaded();
        })
        .catch((error) => {
          console.error(
            `Failed to download and store ${targzFilename}:`,
            error
          );
        })
    );
  }
  console.log(filePromises);
  await Promise.all(filePromises)
    .then(() => {
      console.log("All proof files downloaded and stored");
    })
    .catch((error) => {
      console.error("Error in downloading proof files:", error);
    });
}

export const generateWitnessAndProve = async (circuitInputs: any) => {
  await downloadProofFiles("/", CIRCUIT_NAME, () => {
    console.log("Proof files downloaded");
  });

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    circuitInputs,
    `/${CIRCUIT_NAME}.wasm`,
    `${CIRCUIT_NAME}.zkey`
  );
  console.log(`Generated proof ${JSON.stringify(proof)}`);

  return {
    proof,
    publicSignals,
  };
};
