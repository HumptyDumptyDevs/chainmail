export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_verifier",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_stakeOfAuthenticity",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claim",
    "inputs": [
      {
        "name": "_listingId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createListing",
    "inputs": [
      {
        "name": "_proof",
        "type": "tuple",
        "internalType": "struct Chainmail.Proof",
        "components": [
          {
            "name": "pi_a",
            "type": "uint256[3]",
            "internalType": "uint256[3]"
          },
          {
            "name": "pi_b",
            "type": "uint256[2][3]",
            "internalType": "uint256[2][3]"
          },
          {
            "name": "pi_c",
            "type": "uint256[3]",
            "internalType": "uint256[3]"
          },
          {
            "name": "protocol",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "curve",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "pubSignals",
            "type": "uint256[6]",
            "internalType": "uint256[6]"
          }
        ]
      },
      {
        "name": "_description",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_price",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "dispute",
    "inputs": [
      {
        "name": "_listingId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_buyersSecretPgpKey",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "fulfilListing",
    "inputs": [
      {
        "name": "_listingId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_encryptedMailData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getActiveListings",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct Chainmail.Listing[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum Chainmail.ListingStatus"
          },
          {
            "name": "owner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "price",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "ownerStakeOfAuthenticity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "buyerStakeOfAuthenticity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "proof",
            "type": "tuple",
            "internalType": "struct Chainmail.Proof",
            "components": [
              {
                "name": "pi_a",
                "type": "uint256[3]",
                "internalType": "uint256[3]"
              },
              {
                "name": "pi_b",
                "type": "uint256[2][3]",
                "internalType": "uint256[2][3]"
              },
              {
                "name": "pi_c",
                "type": "uint256[3]",
                "internalType": "uint256[3]"
              },
              {
                "name": "protocol",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "curve",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "pubSignals",
                "type": "uint256[6]",
                "internalType": "uint256[6]"
              }
            ]
          },
          {
            "name": "buyersPublicPgpKey",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "encryptedMailData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "buyer",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBuyersListings",
    "inputs": [
      {
        "name": "_buyer",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct Chainmail.Listing[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum Chainmail.ListingStatus"
          },
          {
            "name": "owner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "price",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "ownerStakeOfAuthenticity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "buyerStakeOfAuthenticity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "proof",
            "type": "tuple",
            "internalType": "struct Chainmail.Proof",
            "components": [
              {
                "name": "pi_a",
                "type": "uint256[3]",
                "internalType": "uint256[3]"
              },
              {
                "name": "pi_b",
                "type": "uint256[2][3]",
                "internalType": "uint256[2][3]"
              },
              {
                "name": "pi_c",
                "type": "uint256[3]",
                "internalType": "uint256[3]"
              },
              {
                "name": "protocol",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "curve",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "pubSignals",
                "type": "uint256[6]",
                "internalType": "uint256[6]"
              }
            ]
          },
          {
            "name": "buyersPublicPgpKey",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "encryptedMailData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "buyer",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDispute",
    "inputs": [
      {
        "name": "_listingId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Chainmail.Dispute",
        "components": [
          {
            "name": "listingId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "buyersSecretPgpKey",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "votesForOwner",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "votesForBuyer",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "reason",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOwnersListings",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct Chainmail.Listing[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum Chainmail.ListingStatus"
          },
          {
            "name": "owner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "price",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "ownerStakeOfAuthenticity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "buyerStakeOfAuthenticity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "proof",
            "type": "tuple",
            "internalType": "struct Chainmail.Proof",
            "components": [
              {
                "name": "pi_a",
                "type": "uint256[3]",
                "internalType": "uint256[3]"
              },
              {
                "name": "pi_b",
                "type": "uint256[2][3]",
                "internalType": "uint256[2][3]"
              },
              {
                "name": "pi_c",
                "type": "uint256[3]",
                "internalType": "uint256[3]"
              },
              {
                "name": "protocol",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "curve",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "pubSignals",
                "type": "uint256[6]",
                "internalType": "uint256[6]"
              }
            ]
          },
          {
            "name": "buyersPublicPgpKey",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "encryptedMailData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "buyer",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getStakeOfAuthenticity",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "i_stakeOfAuthenticity",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "purchaseListing",
    "inputs": [
      {
        "name": "_listingId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_buyersPublicPgpKey",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolve",
    "inputs": [
      {
        "name": "_listingId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "s_disputes",
    "inputs": [
      {
        "name": "listingId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "listingId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "createdAt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "buyersSecretPgpKey",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "votesForOwner",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "votesForBuyer",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "s_listingId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "vote",
    "inputs": [
      {
        "name": "buyerIsRight",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "_listingId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ListingCreated",
    "inputs": [
      {
        "name": "listingId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "description",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "price",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ListingDelivered",
    "inputs": [
      {
        "name": "listingId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "buyer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "encryptedMailData",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ListingDisputeUpdated",
    "inputs": [
      {
        "name": "listingId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "votesForOwner",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "votesForBuyer",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ListingDisputed",
    "inputs": [
      {
        "name": "listingId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "buyer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ListingPurchased",
    "inputs": [
      {
        "name": "listingId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "buyer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "price",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ListingStatusChanged",
    "inputs": [
      {
        "name": "listingId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "status",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum Chainmail.ListingStatus"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "Chainmail__AlreadyVoted",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Chainmail__BuyerTransferFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Chainmail__DisputeDurationPassed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Chainmail__InsufficientEthSent",
    "inputs": [
      {
        "name": "_msgValue",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_totalEthRequired",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "Chainmail__InsufficientStakeOfAuthenticity",
    "inputs": [
      {
        "name": "_msgValue",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_stakeOfAuthenticity",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "Chainmail__InvalidListingId",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Chainmail__InvalidListingOwner",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Chainmail__InvalidListingStatus",
    "inputs": [
      {
        "name": "_status",
        "type": "uint8",
        "internalType": "enum Chainmail.ListingStatus"
      }
    ]
  },
  {
    "type": "error",
    "name": "Chainmail__InvalidProof",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Chainmail__MustBeMoreThanZero",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Chainmail__OwnerTransferFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ERC20InsufficientAllowance",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "allowance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InsufficientBalance",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidApprover",
    "inputs": [
      {
        "name": "approver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidReceiver",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSender",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSpender",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;
