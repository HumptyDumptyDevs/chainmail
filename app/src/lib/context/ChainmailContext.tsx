import { createContext, useContext, ReactNode } from "react";

interface ChainmailContextType {
  activeListings: ListingData[] | undefined;
}

export const ChainmailContext = createContext<ChainmailContextType | null>(
  null
);

export const useChainmail = () => {
  return useContext(ChainmailContext);
};
