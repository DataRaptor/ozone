import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { environment } from "./config";

class Solana {
  private _connection: Connection;

  constructor() {
    this._connection = new Connection(environment.solana.url);
  }

  async getBalances(address: string) {
    const owner = new PublicKey(address);
    const accounts = await this._connection.getTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });

    const balances: { mint: PublicKey | null; amount: number; isNative: number }[] = accounts.value.map((account) => {
      const data = AccountLayout.decode(account.account.data);
      return { mint: new PublicKey(data.mint), amount: Number(data.amount), isNative: Number(data.isNative) };
    });

    const balance = await this._connection.getBalance(owner);
    balances.unshift({ mint: null, amount: balance, isNative: 1 });

    return balances;
  }
}

export const solana = new Solana();
