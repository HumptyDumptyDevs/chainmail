import React, { useEffect } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type TransactionToastProps = {
  isConfirmed: boolean;
  error: any;
  hash: `0x${string}` | undefined;
  isConfirming: boolean;
};

const TransactionToast = ({
  isConfirmed,
  error,
  hash,
  isConfirming,
}: TransactionToastProps) => {
  const toastId = React.useRef(null);
  useEffect(() => {
    const handleClick = () => {
      if (hash) {
        navigator.clipboard.writeText(hash);
        toast.update(toastId.current, {
          render: "Hash copied to clipboard!",
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
          hideProgressBar: true,
        } as ToastOptions);
      }
    };

    const submission = () =>
      (toastId.current = toast.info(
        "Transaction Submitted. Click to copy the transaction hash",
        {
          onClick: handleClick,
        }
      ));

    if (isConfirmed) {
      toast.success("Transaction Confirmed");
    } else if (error) {
      //@ts-ignore
      toast.error((error as BaseError).shortMessage);
    } else if (hash) {
      submission();
    }
  }, [hash, isConfirmed, isConfirming, error]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default TransactionToast;
