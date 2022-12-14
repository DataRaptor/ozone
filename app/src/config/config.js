const env = import.meta.env;

export const config = {
  appName: env.VITE_APP_NAME,
  api: {
    baseUrl: env.VITE_API_BASE_URL,
  },
  solana: {
    env: env.VITE_SOLANA_ENV,
    url: env.VITE_SOLANA_NETWORK_URL,
    explorerUrl: env.VITE_SOLANA_EXPLORER_URL,
  },
};
