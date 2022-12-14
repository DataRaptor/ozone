import { FastifyRequest, FastifyReply } from "fastify";
import { response } from "../utils";
import { CompanyService } from "../services";
import { Service } from "typedi";

@Service()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  public async addCompany(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;
    const payload = {
      name: body.name,
      city: body.city,
      line1: body.line1,
      state: body.state,
      phone: body.phone,
      email: body.email,
      country: body.country,
      taxNumber: body.taxNumber,
      postalCode: body.postalCode,
    };

    const data = await this.companyService.addCompany(payload, { user });
    return response.success(reply, { message: "Company created successfuly", data });
  }

  public async getCompanies(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request;

    const data = await this.companyService.getCompanies({ user });
    return response.success(reply, { message: "Companies fetched successfuly", data });
  }

  public async getCompany(request: FastifyRequest, reply: FastifyReply) {
    const { params, user, company }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
    };
    const data = await this.companyService.getCompany(payload, { user, company });
    return response.success(reply, { message: "Company fetched successfuly", data });
  }

  public async updateCompany(request: FastifyRequest, reply: FastifyReply) {
    const { body, params, user, company }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
      company: {
        email: body.email,
        name: body.name,
        phone: body.phone,
        taxNumber: body.taxNumber,
        city: body.city,
        line1: body.line1,
        state: body.state,
        country: body.country,
        postalCode: body.postalCode,
      },
    };

    const data = await this.companyService.updateCompany(payload, { user, company });
    return response.success(reply, { message: "Company updated successfuly", data });
  }
}
