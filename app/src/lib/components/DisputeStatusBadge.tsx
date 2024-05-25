import React from "react";

interface DisputeStatusBadgeProps {
  status: number;
}

const DisputeStatusBadge: React.FC<DisputeStatusBadgeProps> = ({ status }) => {
  const getBadgeDetails = (status: number) => {
    switch (status) {
      case 0:
        return {
          text: "Active",
          className: "badge badge-primary badge-outline whitespace-nowrap",
        };
      case 1:
        return {
          text: "Completed",
          className: "badge badge-secondary badge-outline whitespace-nowrap",
        };
      default:
        return { text: "Unknown", className: "badge badge-dark badge-outline" };
    }
  };

  const { text, className } = getBadgeDetails(status);

  return <div className={className}>{text}</div>;
};

export default DisputeStatusBadge;
