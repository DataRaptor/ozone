interface Environment {
  port: number
  host: string
  jwtSecret: string
}

export const environment: Environment = {
  host: process.env.HOST || "0.0.0.0",
  port: Number(process.env.PORT) || 9009,
  jwtSecret: process.env.JWT_SECRET || "285aab3566db443891e4f9eec8f681a3",
}
