# Chainmail: ZKP Email Marketplace 📧🛡️

![heh](https://www.highdefdigest.com/blog/wp-content/uploads/2019/01/monty-python-holy-grail-880x320.jpg)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Chainmail is a marketplace for emails verified using Zero-Knowledge Proofs (ZKPs) to prove the authenticity of the sender whilst preserving the anonymity of the recipient.

## 🗺️ Project Overview

The project leverages [ZK Email](https://github.com/zkemail) to generate ZKPs of emails via their DKIM signatures.

By analysing the DKIM signature in the header of an email, we can verify the public key of the sender's domain. Find more details on DKIM [here](https://www.cloudflare.com/en-gb/learning/dns/dns-records/dns-dkim-record/).

After verification, a ZKP of the email is generated via a [circom](https://docs.circom.io/) circuit to hide the recipient address, hash the email body and provide public signals for details such as the sender, subject & ETH address of the owner.

Chainmail then provides a smart-contract backed marketplace to facilite the sale and transmission of these emails between buyers & sellers.

Transaction disputes are mediated via an implemented DAO (Chainmail DAO).

## 🎯 Project Goals

- **Empower information distribution:** Provide a platform and mechanisms for encrypted transmission of email data.
- **Verify authenticity:** Ensure that information transferred between parties is authentic.
- **Protect privacy:** Redact the identity of an email recipient

## 🏗️ Project Structure

- [`app/`](./app) - React app for the marketplace
- [`circuits/`](./circuits) - circom circuitry
- [`foundry/`](./foundry) - Foundry project for marketplace & DAO contracts

## 📚 Getting Started

Navigate to the above folders for specific docs 🧐

<br />
<br />

<div style="text-align: center;">

This project is licensed under the [MIT License](https://opensource.org/license/mit)

Made with ❤️ at [EthBerlin04](https://ethberlin.org)

</div>
