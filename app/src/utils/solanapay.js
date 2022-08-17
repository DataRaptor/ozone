import {
  createQR,
  encodeURL,
  findReference,
  FindReferenceError,
  validateTransfer,
  ValidateTransferError,
} from "@solana/pay";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { connection as conn } from "./connection";

const connection = conn.getConnection();

export const solanapay = {
  getQR(data, size) {
    return createQR(solanapay.generateRequestLink(data), size);
  },

  generateRequestLink({ recipient, reference, amount, token, label, message } = {}) {
    amount = new BigNumber(amount);
    const referencePublicKey = new PublicKey(reference);
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

    return encodeURL({
      label,
      amount,
      message,
      splToken,
      memo: message,
      recipient: recipientPulicKey,
      reference: referencePublicKey,
    });
  },

  async findReference(reference) {
    return await findReference(connection, reference, { finality: "confirmed" });
  },

  async validateTransfer({ signature, recipient, amount, splToken }) {
    return await validateTransfer(connection, signature, { recipient, amount, splToken });
  },

  waitForPayment({ reference, recipient, amount, splToken }, callback) {
    reference = new PublicKey(reference);
    recipient = new PublicKey(recipient);
    splToken = splToken ? new PublicKey(splToken) : undefined;

    async function execute() {
      try {
        const result = await solanapay.findReference(reference);
        await solanapay.validateTransfer({ signature: result.signature, recipient, amount, splToken });
        callback(result.signature);
      } catch (e) {
        if (!(e instanceof FindReferenceError) && !(e instanceof ValidateTransferError)) {
          throw e;
        }

        setTimeout(execute, 200);
      }
    }

    setTimeout(execute, 200);
  },
};
