import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.action === "findMany") {
    if (!params.args) {
      params.args = {};
    }

    params.args.orderBy = { createdAt: "desc" };
  }

  return await next(params);
});
