-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil

DEFAULT_ANVIL_PRIVATE_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
DEFAULT_ANVIL_PUBLIC_KEY := 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

help:
	@echo "Usage:"
	@echo "  make deploy [ARGS=...]\n    example: make deploy ARGS=\"--network sepolia\""
	@echo ""
	@echo "  make fund [ARGS=...]\n    example: make fund ARGS=\"--network sepolia\""

all: clean remove install update build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install cyfrin/foundry-devops@0.0.11 --no-commit && forge install smartcontractkit/chainlink-brownie-contracts@0.6.1 --no-commit && forge install foundry-rs/forge-std@v1.5.3 --no-commit

# Update Dependencies
update:; forge update

build:; forge build

test :; forge test

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

send-eth :; cast send $(ADDRESS) --rpc-url $(RPC_URL) --value 1000ether --account local

NETWORK_ARGS := --rpc-url $(RPC_URL)  --account local --broadcast

ifeq ($(findstring --network local ,$(ARGS)),--network local) 
	NETWORK_ARGS := --rpc-url $(RPC_URL) --account sepolia --broadcast 
endif

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account sepolia --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
endif

deploy:
	@forge script script/DeployChainmail.s.sol:DeployChainmail $(NETWORK_ARGS)

create-listing:
	@forge script script/Interactions.s.sol:CreateListing $(NETWORK_ARGS) --sender $(DEFAULT_ANVIL_PUBLIC_KEY) -vvvv