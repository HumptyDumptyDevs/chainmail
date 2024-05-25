import * as snarkjs from "snarkjs";
import { downloadWithRetries } from "./utils";

export async function verifyProof(proof: Proof) {
  try {
    const verificationKeyUrl = "/chainmail.vkey.json";

    // Convert public signals and proof components to string arrays
    const publicSignals = proof.pubSignals.map((signal) => signal.toString());

    const proofToVerify = {
      pi_a: proof.pi_a.map((a) => `${a}`),
      pi_b: proof.pi_b.map((pair) => pair.map((p) => `${p}`)),
      pi_c: proof.pi_c.map((c) => `${c}`),
      protocol: "groth16",
      curve: "bn128",
    };

    // console.log("Proof to verify:", proofToVerify);

    const response = await downloadWithRetries(verificationKeyUrl, 3);
    const verificationKey = await response.json();

    // Verify the proof
    const isValid = await snarkjs.groth16.verify(
      verificationKey,
      publicSignals,
      proofToVerify
    );
    console.log("Verification result:", isValid);
    return isValid;
  } catch (error) {
    console.error("Failed to verify proof:", error);
    return false;
  }
}
