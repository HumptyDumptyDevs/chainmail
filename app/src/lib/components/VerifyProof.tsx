import { verifyProof } from "../utils/verifyProof";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type VerifyProofProps = {
  proof: Proof | undefined;
};

const VerifyProof = ({ proof }: VerifyProofProps) => {
  const verifyEmailProof = async () => {
    if (!proof) return;
    toast.promise(verifyProof(proof), {
      pending: "Verifying proof...",
      success: "Proof verified!",
      error: "Proof verification failed",
    });
  };

  return (
    <>
      <button
        className="btn btn-primary"
        disabled={!proof}
        onClick={verifyEmailProof}
      >
        Verify Proof
      </button>
      <ToastContainer />
    </>
  );
};

export default VerifyProof;
