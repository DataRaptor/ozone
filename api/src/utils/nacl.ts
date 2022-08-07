import tweetnacl from "tweetnacl"
import bs58 from "bs58"

export const nacl = {
  verifyMessage(message: string, signature: string, publicKey: string) {
    return tweetnacl.sign.detached.verify(
      new Uint8Array(Buffer.from(message, "utf8")),
      bs58.decode(signature),
      bs58.decode(publicKey)
    )
  },
}
