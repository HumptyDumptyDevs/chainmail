# Chainmail circom

This directory contains a circom circuit leveraging [ZK Email](https://github.com/zkemail) libraries & a helper script to generate the zKey & verification keys to be used by the app and smart-contract.

## 📚 Getting Started

#### Pre-requisites

**1. Install circom**

circom is required to be installed - installation instructions can be found at: https://docs.circom.io/getting-started/installation/

**2. Install ts-node**

We require ts-node to run the input generation script:

```
npm i ts-node -g
```

**3. Install packages in root directory**

Install dependencies:

```
cd ..
yarn install
cd -
```

<br />

#### Steps

**1. Obtain Powers of Tau**

Chainmail has been tested using PTAU ^22 with 4m contraints.

You can either generate this via a ceremony yourself, or download them.
See https://github.com/iden3/snarkjs for details.

For the purpose of this documentation, we will download them:

```
wget https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_22.ptau
```

**2. Compile circuit**

Compile the circuit:

```
circom -l ../node_modules/  --wasm --r1cs chainmail.circom
```

Compiling the circuit will produce outputs:

**`chainmail.r1cs`** - a file representing the circuit's constraints
**`chainmail_js/chainmail.wasm`** - a WebAssembly file that contains an optimized version of the circuit logic
**`chainmail_js/generate_witness.js`** - a script to generate the witness file using inputs (generated in next step)

**3. Prepare build files**

Prep files required for key generation:

```
mkdir build
mv powersOfTau28_hez_final_22.ptau build/
cp chainmail.r1cs build/
cp -R chainmail_js build/
```

**4. Generate keys**

Generate the zKeys & verification key:

```
cd scripts
NODE_OPTIONS="--max-old-space-size=614400" ts-node setup.ts
```

**5. Copy artifacts into app**

```
cp build/artifacts/* ../app/public
```
