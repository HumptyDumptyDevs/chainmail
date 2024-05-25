import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAccount } from "wagmi";
import { generateWitnessAndProve } from "@/lib/utils/generateProof";
import { generateCircuitInputs } from "@/lib/utils/generateInputs";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { extractDKIMHeaderBodyHash, extractEmailBody } from "@/lib/utils/utils";
import { verifyEmailBodyHash } from "@/lib/utils/verifyHash";

type GenerateZkProofProps = {
  setProof: (proof: Proof) => void;
  setEmailBody: (emailBody: string) => void;
};

const GenerateZkProof = ({ setProof, setEmailBody }: GenerateZkProofProps) => {
  const [rawEmail, setRawEmail] = useState("");
  const [bodyHash, setBodyHash] = useState("");
  const [generating, setGenerating] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const { address } = useAccount();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0];
      if (file.type === "message/rfc822") {
        // Check if it's an EML file
        const reader = new FileReader();
        reader.onload = (event) => {
          setRawEmail(event.target?.result as string);
          setBodyHash(
            extractDKIMHeaderBodyHash(event.target?.result as string)
          );
          setEmailBody(extractEmailBody(event.target?.result as string));
          localStorage.setItem("email", JSON.stringify(event.target?.result));
        };
        reader.readAsText(file);
        setFileName(file.name);
        setFileSelected(true);
      } else {
        toast.error("Please select a valid EML file.");
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "message/rfc822": [".eml"], // Accept only EML files
    },
    maxFiles: 1, // Only allow one file to be uploaded
  });

  const verifyTheHash = async () => {
    const bodyHash = extractDKIMHeaderBodyHash(rawEmail);
    const body = extractEmailBody(rawEmail);
    try {
      const success = await verifyEmailBodyHash(body, bodyHash);
      if (!success) {
        throw new Error("Body hash does not match");
      }
    } catch (error) {
      throw new Error("Body hash does not match");
    }
  };

  const generateProof = async () => {
    try {
      //Ensure we can verify the hash
      await verifyTheHash();

      setGenerating(true);
      const circuitInputs = await generateCircuitInputs(
        address as `0x${string}`,
        rawEmail
      );
      console.log(circuitInputs);
      const { proof, publicSignals } = await generateWitnessAndProve(
        circuitInputs
      );

      const myProof = {
        ...proof,
        pubSignals: publicSignals,
      };

      setEmailBody(extractEmailBody(rawEmail));

      localStorage.setItem("proof", JSON.stringify(myProof));
      setProof(myProof);
      setGenerating(false);
    } catch (error) {
      console.error("Failed to generate proof:", error);
      toast.error("Something went wrong. Please try again.");
      setGenerating(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 max-w-lg text-center">
      <h1 className="font-bold text-text1 text-4xl">Add your email</h1>
      <p className="text-text2 text-sm">You need to upload an EML file here.</p>
      <p className="text-text2 text-sm">
        Follow this{" "}
        <Link
          className="link link-primary"
          to={`https://support.google.com/mail/answer/9261412?hl=en`}
        >
          link
        </Link>{" "}
        to find out how to download one.
      </p>
      <p className="text-text2 text-sm">
        The zk proof is done completely on the client side so no one will ever
        see your identity. This can take up to 5 minutes so please be patient.
      </p>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""} ${
          fileSelected ? "file-selected" : ""
        } h-56 resize-none flex-grow text-sm border rounded-lg border-dashed border-primary1 p-2 bg-background1 flex flex-col items-center justify-center`} // Combined styling classes
      >
        <input {...getInputProps()} />
        {fileSelected ? (
          <p>{fileName}</p>
        ) : (
          <>
            <p className="text-center mb-2">Drag and drop an .eml file here</p>
            <p className="text-center mb-2">or</p>
            <button type="button" className="btn btn-sm">
              Click to upload
            </button>
          </>
        )}
      </div>
      <div className="flex justify-center">
        <button
          onClick={generateProof}
          disabled={generating || !!localStorage.getItem("proof")}
          className="btn  btn-primary"
        >
          Generate ZK Proof
          <span
            className={`${generating && "loading loading-spinner loading-sm"}`}
          ></span>
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GenerateZkProof;
