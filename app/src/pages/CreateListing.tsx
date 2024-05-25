import {
  GenerateZkProof,
  AddListing,
  VerifyProof,
  PublicSignals,
} from "@/components/index";

import { useState } from "react";

const CreateListing = () => {
  //Look for localStorage proof
  const storedProof = localStorage.getItem("proof");
  // const storedProof = undefined;

  const [proof, setProof] = useState<Proof | undefined>(
    storedProof ? JSON.parse(storedProof) : undefined
  );

  const [emailBody, setEmailBody] = useState("");

  return (
    <>
      <div className="flex flex-col h-[75vh] p-10 gap-10">
        {!proof ? (
          <div className="flex justify-center w-full">
            <GenerateZkProof setEmailBody={setEmailBody} setProof={setProof} />
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="flex flex-col gap-4 items-center">
                <h1 className="text-2xl font-bold text-text2 mb-4">
                  Full Proof
                </h1>
                <div className="border h-60 w-2/3 rounded-lg border-primary1 p-2 bg-background1 mb-4 overflow-y-auto">
                  <pre className="text-xs">
                    {JSON.stringify(proof, null, 2)}
                  </pre>
                </div>
                <VerifyProof proof={proof} />
              </div>
              <div className="">
                <PublicSignals pubSignals={proof?.pubSignals} />
              </div>
            </div>
            <div className="flex justify-center">
              <AddListing emailBody={emailBody} proof={proof} />
            </div>
            <div className="flex w-full justify-center pb-10">
              <button
                onClick={() => {
                  localStorage.removeItem("proof");
                  setProof(undefined);
                }}
                className="btn btn-outline"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CreateListing;