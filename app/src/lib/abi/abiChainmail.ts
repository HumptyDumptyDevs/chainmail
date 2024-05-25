export const abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_verifier",
        type: "address",
        internalType: "address",
      },
      {
        name: "_stakeOfAuthenticity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createListing",
    inputs: [
      {
        name: "_proof",
        type: "tuple",
        internalType: "struct Chainmail.Proof",
        components: [
          {
            name: "pi_a",
            type: "uint256[3]",
            internalType: "uint256[3]",
          },
          {
            name: "pi_b",
            type: "uint256[2][3]",
            internalType: "uint256[2][3]",
          },
          {
            name: "pi_c",
            type: "uint256[3]",
            internalType: "uint256[3]",
          },
          {
            name: "protocol",
            type: "string",
            internalType: "string",
          },
          {
            name: "curve",
            type: "string",
            internalType: "string",
          },
          {
            name: "pubSignals",
            type: "uint256[5]",
            internalType: "uint256[5]",
          },
        ],
      },
      {
        name: "_description",
        type: "string",
        internalType: "string",
      },
      {
        name: "_price",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "fulfilListing",
    inputs: [
      {
        name: "_listingId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_encryptedMailData",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "_buyersPublicPgpKeyHash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getActiveListings",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct Chainmail.Listing[]",
        components: [
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "status",
            type: "uint8",
            internalType: "enum Chainmail.ListingStatus",
          },
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "ownerStakeOfAuthenticity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "buyerStakeOfAuthenticity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "createdAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "proof",
            type: "tuple",
            internalType: "struct Chainmail.Proof",
            components: [
              {
                name: "pi_a",
                type: "uint256[3]",
                internalType: "uint256[3]",
              },
              {
                name: "pi_b",
                type: "uint256[2][3]",
                internalType: "uint256[2][3]",
              },
              {
                name: "pi_c",
                type: "uint256[3]",
                internalType: "uint256[3]",
              },
              {
                name: "protocol",
                type: "string",
                internalType: "string",
              },
              {
                name: "curve",
                type: "string",
                internalType: "string",
              },
              {
                name: "pubSignals",
                type: "uint256[5]",
                internalType: "uint256[5]",
              },
            ],
          },
          {
            name: "buyersPublicPgpKey",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "encryptedMailData",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "buyer",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStakeOfAuthenticity",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "purchaseListing",
    inputs: [
      {
        name: "_listingId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_buyersPublicPgpKey",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "ListingCreated",
    inputs: [
      {
        name: "listingId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "description",
        type: "string",
        indexed: true,
        internalType: "string",
      },
      {
        name: "price",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ListingStatusChanged",
    inputs: [
      {
        name: "listingId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "status",
        type: "uint8",
        indexed: true,
        internalType: "enum Chainmail.ListingStatus",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "Chainmail__InsufficientStakeOfAuthenticity",
    inputs: [
      {
        name: "_msgValue",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_stakeOfAuthenticity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "Chainmail__InvalidProof",
    inputs: [],
  },
  {
    type: "error",
    name: "Chainmail__MustBeMoreThanZero",
    inputs: [],
  },
] as const;
