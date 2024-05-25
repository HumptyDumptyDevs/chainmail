import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="p-10 w-full mx-auto flex justify-between">
      <div className="flex flex-grow flex-shrink-0 justify-start">
        <Link className="flex items-center" to="/">
          <img
            src="/chainmail_wordmark.png"
            alt="Chainmail"
            className="h-10 w-auto mx-auto" // Adjust height and width as needed
          />
        </Link>
      </div>
      <div className="navbar flex-grow flex-shrink bg-base-100 flex justify-center ">
        <Link className="btn btn-ghost link link-primary" to={`/`}>
          View All Listings
        </Link>
        <Link
          className="btn btn-ghost link link-primary"
          to={`/create-listing`}
        >
          Create Listing
        </Link>
        <Link className="btn btn-ghost link link-primary" to={`/my-listings`}>
          My Listings
        </Link>
        <Link className="btn btn-ghost link link-primary" to={`/my-orders`}>
          My Orders
        </Link>
        <Link className="btn btn-ghost link link-primary" to={`/disputes`}>
          Disputes
        </Link>
      </div>
      <div className="flex flex-grow flex-shrink-0 items-center justify-end">
        <ConnectButton
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "avatar",
          }}
          showBalance={{
            smallScreen: false,
            largeScreen: false,
          }}
        />
      </div>
    </div>
  );
};

export default Header;
