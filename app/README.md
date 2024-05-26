# Chainmail Marketplace

This code runs a marketplace to facilitate the transactions of emails via Zero-Knowledge Proofs (ZKPs).

**[React](https://react.dev/) | [Vite](https://vitejs.dev/) | [wagmi](https://wagmi.sh/) | [RainbowKit](https://www.rainbowkit.com/) | [snarkjs](https://github.com/iden3/snarkjs) | [openpgp](https://openpgpjs.org/) | [Tailwind CSS](https://tailwindcss.com/) | [daisyUI](https://daisyui.com/) | [ApexCharts](https://apexcharts.com/)**

## 📚 Getting Started

#### Pre-requisites

**1. Obtain witness, verifier & zKeys**

Navigate to [../circuits](../circuits) for instructions.

Copy the below files into [./public](./public):

```
chainmail.wasm
chainmail.vkey.json
chainmail.zkey{abc...}  <-- Ensure all zKey chunks are copied
```

**2. Create .env.local file with contract address**

Navigate to [../foundry](../foundry) for instructions on how to deploy the contracts locally with Foundry.

```bash
VITE_CHAINMAIL_CONTRACT_ADDRESS=...
```

<br />

#### Steps

**1. Install dependencies**

```bash
yarn install
```

**2. Run development server**

```bash
yarn dev
```
