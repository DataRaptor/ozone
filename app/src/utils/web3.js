import { PublicKey } from "@solana/web3.js"

export const web3 = {
  toDecimals(amount, decimals) {
    amount = Number(amount)
    decimals = Number(decimals)
    if (isNaN(amount)) return 0
    if (isNaN(decimals)) return 0

    return amount * Math.pow(10, decimals)
  },

  fromDecimals(amount, decimals) {
    amount = Number(amount)
    decimals = Number(decimals)
    if (isNaN(amount)) return 0
    if (isNaN(decimals)) return 0

    return amount / Math.pow(10, decimals)
  },

  isValidAddress(value) {
    const publicKey = new PublicKey(value)
    return PublicKey.isOnCurve(publicKey)
  },
}
