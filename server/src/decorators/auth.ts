import { prisma } from "../database/prisma";
import { ApiError } from "../errors";
import { IReply, IRequest } from "../interfaces";
import { response } from "../utils/response";

export interface IOptions {
  optional?: boolean;
}

export const auth = {
  user(options: IOptions = {}) {
    return async (request: IRequest, reply: IReply) => {
      try {
        const data: any = await request.jwtVerify({});
        const user = await prisma.user.findUnique({ where: { id: data.id } });

        if (!user) {
          throw new ApiError("Authorization token is invalid", 401);
        }

        request.user = user;
      } catch (err: any) {
        if (!options.optional) {
          response.error(reply, { message: err.message, status: 401 });
        }
      }
    };
  },

  company(options: IOptions = {}) {
    return async (request: IRequest, reply: IReply) => {
      try {
        if (!request.user) {
          throw new ApiError("User authentication is required", 401);
        }

        const companyId = await request.headers["x-company-id"];
        if (!companyId) {
          throw new ApiError("Company ID is missing in request header", 403);
        }

        const company = await prisma.company.findUnique({ where: { id: companyId as string } });
        if (!company) {
          throw new ApiError("Company does not exist", 404);
        }

        if (company.ownerId !== request.user.id) {
          throw new ApiError("User does not have access to this company", 403);
        }

        request.company = company;
      } catch (err: any) {
        if (!options.optional) {
          response.error(reply, { message: err.message, status: err.status });
        }
      }
    };
  },
};
