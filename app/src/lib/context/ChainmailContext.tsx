import { createContext, useContext, ReactNode } from "react";
import { abi } from "@/lib/abi/abiChainmail";
import { useAccount, useReadContracts, useWatchContractEvent } from "wagmi";

interface ChainmailContextType {
  activeListings: readonly ListingData[] | undefined;
  ownersListings: readonly ListingData[] | undefined;
  buyersListings: readonly ListingData[] | undefined;
  disputeDuration: bigint | undefined;
  listingsLoading: boolean;
  stakeOfAuthenticity: bigint | undefined;
  myTokenBalance: bigint | undefined;
}

export const ChainmailContext = createContext<ChainmailContextType | null>(
  null
);

export const useChainmail = () => {
  return useContext(ChainmailContext);
};

type ChainmailProviderProps = {
  children: ReactNode;
};

export const ChainmailProvider = ({ children }: ChainmailProviderProps) => {
  const chainmailContractConfig = {
    address: import.meta.env.VITE_CHAINMAIL_CONTRACT_ADDRESS as `0x${string}`,
    abi: abi,
  };

  const account = useAccount();
  const address = account?.address;

  const {
    data: listingsResponse,
    isLoading: listingsLoading,
    refetch: refetchListings,
    error: listingsError,
  } = useReadContracts({
    contracts: [
      {
        ...chainmailContractConfig,
        functionName: "getActiveListings",
      },
      {
        ...chainmailContractConfig,
        functionName: "getOwnersListings",
        args: [address as `0x${string}`],
      },
      {
        ...chainmailContractConfig,
        functionName: "getBuyersListings",
        args: [address as `0x${string}`],
      },
      {
        ...chainmailContractConfig,
        functionName: "getStakeOfAuthenticity",
      },
      {
        ...chainmailContractConfig,
        functionName: "DISPUTE_DURATION",
      },
      {
        ...chainmailContractConfig,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      },
    ],
  });

  useWatchContractEvent({
    ...chainmailContractConfig,
    eventName: "ListingStatusChanged",
    onLogs(logs) {
      refetchListings();
    },
    onError(error) {
      console.error("Listing Status Changed Error:", error);
    },
  });

  const activeListings = listingsResponse?.[0]?.result;
  const ownersListings = listingsResponse?.[1]?.result;
  const buyersListings = listingsResponse?.[2]?.result;
  const stakeOfAuthenticity = listingsResponse?.[3]?.result;
  const disputeDuration = listingsResponse?.[4]?.result;
  const myTokenBalance = listingsResponse?.[5]?.result;

  console.log("activeListings", activeListings);

  return (
    <ChainmailContext.Provider
      value={{
        activeListings,
        ownersListings,
        buyersListings,
        listingsLoading,
        stakeOfAuthenticity,
        disputeDuration,
        myTokenBalance,
      }}
    >
      {children}
    </ChainmailContext.Provider>
  );
};
