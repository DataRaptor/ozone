import { createQR, encodeURL, findReference, validateTransfer } from "@solana/pay";
import { Keypair, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

export const solanapay = {
  getQR(data) {
    console.log(data);
    return createQR(solanapay.generateRequestLink(data), 400);
  },

  generateRequestLink({ recipient, amount, token, label, message } = {}) {
    amount = new BigNumber(amount);
    const reference = new Keypair().publicKey;
    const recipientPulicKey = new PublicKey(recipient);

    if (!PublicKey.isOnCurve(recipientPulicKey)) {
      throw new Error("Invalid merchant address...");
    }

    let splToken;

    if (token) {
      splToken = new PublicKey(token);
      if (!PublicKey.isOnCurve(splToken)) {
        throw new Error("Invalid token address...");
      }
    }

    return encodeURL({ recipient: recipientPulicKey, reference, splToken, message, amount, label, memo: message });
  },

  async findReference(connection, reference) {
    return await findReference(connection, reference, { finality: "confirmed" });
  },

  async validateTransfer({ signature, recipient, amount }, connection) {
    return await validateTransfer(connection, signature, { recipient, amount });
  },
};
