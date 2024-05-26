# Chainmail Foundry

The Chainmail smart-contracts and supporting functionality are built using Foundry. Find the Foundry docs here: https://book.getfoundry.sh/

## 📚 Getting Started

#### Pre-requisites

**1. Install Foundry**
Installation docs can be found here: https://book.getfoundry.sh/getting-started/installation

\*\*2. Install dependencies
This project uses [foundry-devops](https://github.com/Cyfrin/foundry-devops) from [Cyfrin](https://www.cyfrin.io/) to help run interactions, to install:

```
forge install Cyfrin/foundry-devops --no-commit
```

**2. Run local test chain with anvil**
You can use `make` to run preset commands from the [Makefile](./Makefile). To start a local test chain using anvil:

```
make anvil
```

**3. Connect browser wallet provider to local network**
You can find the anvil local chain details at the beginning of the anvil output. You can add the network to your browser wallet provider like Metamask: https://support.metamask.io/networks-and-sidechains/managing-networks/how-to-add-a-custom-network-rpc/#adding-a-network-manually

**4. Create .env file**
Populate the below values according to your RPC URLs, keys & address:

```
RPC_URL=http://127.0.0.1:8545
SEPOLIA_RPC_URL=...
MAINNET_RPC_URL=...
ETHERSCAN_API_KEY=...
PRIVATE_KEY=...
ADDRESS=...
```

**5. Import local wallet**
Import the wallet set in the `.env` file above:

```
cast wallet import local --interactive
```

**6. Fund local wallet**
You can use `make` to send local test ETH to your wallet:

```
make send-eth
```

<br />

#### Steps

**1. Test contracts**
Run contract tests:

```
forge test
```

**2. Deploy contracts**
To deploy the contract locally:

```
make deploy
```

**3. Copy contract address into app**
Once the contract is deployed locally, populate a **`.env.local`** file in [**`../app`**](../app)

```
VITE_CHAINMAIL_CONTRACT_ADDRESS=...
```
