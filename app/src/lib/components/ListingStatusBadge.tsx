import React from "react";

interface ListingStatusBadgeProps {
  status: number;
}

const ListingStatusBadge: React.FC<ListingStatusBadgeProps> = ({ status }) => {
  const getBadgeDetails = (status: number) => {
    switch (status) {
      case 0:
        return {
          text: "Active",
          className: "badge badge-primary badge-outline whitespace-nowrap",
        };
      case 1:
        return {
          text: "Pending Delivery",
          className: "badge badge-warning badge-outline whitespace-nowrap",
        };
      case 2:
        return {
          text: "Fulfilled",
          className: "badge badge-success badge-outline whitespace-nowrap",
        };
      case 3:
        return {
          text: "Cancelled",
          className: "badge badge-error badge-outline whitespace-nowrap",
        };
      case 4:
        return {
          text: "Expired",
          className: "badge badge-danger badge-outline whitespace-nowrap",
        };
      default:
        return { text: "Unknown", className: "badge badge-dark badge-outline" };
    }
  };

  const { text, className } = getBadgeDetails(status);

  return <div className={className}>{text}</div>;
};

export default ListingStatusBadge;
