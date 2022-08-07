const env = import.meta.env

export const config = {
  api: {
    baseUrl: env.VITE_API_BASE_URL,
  },
  avatarApiBaseUrl: "https://ui-avatars.com/api/",
}
