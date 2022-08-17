import { request } from "../config";
import { useTokenStore } from "../stores";

export class TokenService {
  async loadTokens() {
    const tokenStore = useTokenStore();

    const tokens = await request.api.get("/tokens");
    tokenStore.setTokens(tokens.data);
  }
}
