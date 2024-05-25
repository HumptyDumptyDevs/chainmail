import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="p-10 w-full mx-auto flex justify-between">
      <div className="flex flex-grow flex-shrink-0 justify-start">
        <Link className="flex items-center" to="/">
          <h1 className="text-center uppercase font-extrabold leading-loose text-4xl text-text1">
            Chainmail
          </h1>
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
