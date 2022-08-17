import { Connection } from "@solana/web3.js";
import { config } from "../config/config";

const urls = {
  phantom: "https://phantom.app/",
  solflare: "https://solflare.com/",
  slope: "https://slope.finance/",
};

export const connection = {
  provider(client) {
    if (client === "slope" && "Slope" in window) {
      const provider = new window.Slope();
      Object.assign(provider, window.slope);

      return provider;
    } else if (client in window) {
      const provider = window[client]?.solana || window[client];

      return provider;
    }

    window.open(urls[client], "_blank");
  },

  async connect(client) {
    const provider = connection.provider(client);
    const connect = await provider.connect();

    let publicKey;
    if (client === "slope") {
      publicKey = connect.data.publicKey;
    } else {
      publicKey = provider.publicKey;
    }

    return publicKey.toString();
  },

  async signMessage(client, message) {
    const provider = connection.provider(client);
    const encodedMessage = new TextEncoder().encode(message);

    let signedMessage;

    if (client === "slope") {
      signedMessage = await provider.signMessage(encodedMessage, "utf8");
    } else {
      signedMessage = await provider.request({
        method: "signMessage",
        params: { message: encodedMessage, display: "utf8" },
      });
    }

    return signedMessage.data || signedMessage;
  },

  getConnection() {
    return new Connection(config.solana.url);
  },
};
