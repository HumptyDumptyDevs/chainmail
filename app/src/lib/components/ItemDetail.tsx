import React from "react";

type ItemDetailProps = {
  title: string;
  children: React.ReactNode;
};

const ItemDetail = ({ title, children }: ItemDetailProps) => {
  return (
    <div className="flex justify-center">
      <h3 className="w-1/3 font-bold flex justify-end mr-10 whitespace-nowrap">
        {title}:
      </h3>
      <div className="w-full border rounded-lg overflow-auto border-primary1 p-2 bg-background1">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ItemDetail;
