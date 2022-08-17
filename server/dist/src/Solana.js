"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solana = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("./config");
class Solana {
    constructor() {
        this._connection = new web3_js_1.Connection(config_1.environment.solana.url);
    }
    getBalances(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = new web3_js_1.PublicKey(address);
            const accounts = yield this._connection.getTokenAccountsByOwner(owner, { programId: spl_token_1.TOKEN_PROGRAM_ID });
            const balances = accounts.value.map((account) => {
                const data = spl_token_1.AccountLayout.decode(account.account.data);
                return { mint: new web3_js_1.PublicKey(data.mint), amount: Number(data.amount), isNative: Number(data.isNative) };
            });
            const balance = yield this._connection.getBalance(owner);
            balances.unshift({ mint: null, amount: balance, isNative: 1 });
            return balances;
        });
    }
}
exports.solana = new Solana();
