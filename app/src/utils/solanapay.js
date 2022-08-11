import { createQR, encodeURL } from "@solana/pay"
import { Keypair, PublicKey } from "@solana/web3.js"
import BigNumber from "bignumber.js"

export const solanapay = {
  getQR(data) {
    return createQR(solanapay.generateRequestLink(data))
  },

  generateRequestLink({ recipient, amount, token } = {}) {
    const amt = new BigNumber(amount)
    const reference = new Keypair().publicKey
    const recipientAddress = new PublicKey(recipient)
    // const splToken = new PublicKey(token)

    if (!PublicKey.isOnCurve(recipientAddress)) {
      throw new Error("Invalid merchant address...")
    }

    // if (!PublicKey.isOnCurve(splToken)) {
    //   throw new Error("Invalid token address...")
    // }

    const label = "Jungle Cats store"
    const message = "Jungle Cats store - your order - #001234"
    const memo = "JC#4098"

    return encodeURL({
      recipient: recipientAddress,
      amount: amt,
      reference,
      // splToken,
      message,
      label,
      memo,
    })
  },
}
