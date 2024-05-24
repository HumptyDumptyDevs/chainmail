const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Paths to the ABI file
const abiFilePath = path.join(__dirname, "../app/src/lib/abi/abiChainmail.ts");

// Command to run forge inspect
const command = "forge inspect Chainmail abi";

// Execute the forge inspect command
exec(
  command,
  { cwd: path.join(__dirname, "../foundry") },
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing forge inspect: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }

    // Read the ABI data from the command output
    const abiData = stdout.trim();

    // Format the ABI data as required
    const formattedAbi = `export const abi = ${abiData} as const;\n`;

    // Write the formatted ABI to the abiChainmail.ts file
    fs.writeFileSync(abiFilePath, formattedAbi, "utf8");

    console.log("ABI has been successfully written to abiChainmail.ts");
  }
);
