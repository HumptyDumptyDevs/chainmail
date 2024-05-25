import * as openpgp from "openpgp";

export const generateKeyPair = async (address: string) => {
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: "ecc",
    curve: "curve25519",
    userIDs: [{ name: address }],
    format: "armored",
  });

  return { privateKey, publicKey };
};

export const encryptMessage = async (message: string, publicKey: string) => {
  const encryptMessage = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: message }),
    encryptionKeys: await openpgp.readKey({ armoredKey: publicKey }),
  });

  return encryptMessage;
};

export const decryptMessage = async (
  encryptedMessage: string,
  _privateKey: string
) => {
  const message = await openpgp.readMessage({
    armoredMessage: encryptedMessage,
  });

  const privateKey = await openpgp.readPrivateKey({ armoredKey: _privateKey });

  const { data: decrypted } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });

  return decrypted;
};
