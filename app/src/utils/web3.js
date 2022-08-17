import { PublicKey } from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

export const web3 = {
  toDecimals(amount, decimals) {
    amount = Number(amount);
    decimals = Number(decimals);
    if (isNaN(amount)) return 0;
    if (isNaN(decimals)) return 0;

    return amount * Math.pow(10, decimals);
  },

  fromDecimals(amount, decimals) {
    amount = Number(amount);
    decimals = Number(decimals);
    if (isNaN(amount)) return 0;
    if (isNaN(decimals)) return 0;

    return amount / Math.pow(10, decimals);
  },

  isValidAddress(value) {
    const publicKey = new PublicKey(value);
    return PublicKey.isOnCurve(publicKey);
  },

  getBalances() {
    getba(connection, mint, owner);
  },
};
