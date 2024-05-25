/// <reference types="vite/client" />

declare module "snarkjs";

interface PGPKeyPair {
  privateKey: string;
  publicKey: string;
}

interface Proof {
  pi_a: readonly [bigint, bigint, bigint];
  pi_b: readonly [
    readonly [bigint, bigint],
    readonly [bigint, bigint],
    readonly [bigint, bigint]
  ];
  pi_c: readonly [bigint, bigint, bigint];
  protocol: string;
  curve: string;
  pubSignals: readonly [bigint, bigint, bigint, bigint, bigint, bigint];
}

type DecodedPublicSignals = {
  emailHash: string;
  emailFrom: string;
  emailSubject: string;
  emailPublicKey: string;
  address: `0x${string}`;
};

interface DisputeData {
  listingId: bigint;
  createdAt: bigint;
  buyersSecretPgpKey: `0x${string}`;
  votesForOwner: bigint;
  votesForBuyer: bigint;
  reason: string;
}

interface ListingData {
  id: bigint;
  status: number;
  owner: `0x${string}`;
  buyer: `0x${string}`;
  description: string;
  price: bigint;
  createdAt: bigint;
  ownerStakeOfAuthenticity: bigint;
  buyerStakeOfAuthenticity: bigint;
  proof: Proof;
  buyersPublicPgpKey?: `0x${string}`;
  encryptedMailData?: `0x${string}`;
}
