import { AllListings, VotesBar } from "@/lib/components";

export default function Home() {
  return (
    <main className="flex flex-col max-w-4xl mx-auto">
      <AllListings />
      // For reference
      {/* <VotesBar votesForBuyer={125} votesForSeller={88}/> */}
    </main>
  );
}
