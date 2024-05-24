import { createContext, useContext, ReactNode } from "react";

interface MailMarketplaceContextType {
  activeListings: ListingData[] | undefined;
}

export const MailMarketplaceContext =
  createContext<MailMarketplaceContextType | null>(null);

export const useMailMarketplace = () => {
  return useContext(MailMarketplaceContext);
};
