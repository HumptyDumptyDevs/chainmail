/// <reference types="vite/client" />

declare module "snarkjs";

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
