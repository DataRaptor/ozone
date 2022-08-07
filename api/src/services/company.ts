import { Service } from "typedi"
import { prisma } from "../database/prisma"
import { ApiError } from "../errors"
import { IGetCompanyPayload, IUpdateCompanyPayload, IUser } from "../interfaces"
import { companySchema } from "../schema"
import { utils } from "../utils"

@Service()
export class CompanyService {
  public async getCompanies(user: IUser) {
    const companies = await prisma.company.findMany({ where: { owner: { id: user.id } } })
    return companies
  }

  public async getCompany(payload: IGetCompanyPayload, user: IUser) {
    const cleanPayload: IGetCompanyPayload = utils.clean(payload)
    const company = await prisma.company.findUnique({ where: { id: cleanPayload.id } })

    if (!company) {
      throw new ApiError("Company does not exist", 404)
    }
    if (company.ownerId !== user.id) {
      throw new ApiError("You do not have permission to view this resoure", 403)
    }

    return company
  }

  public async updateCompany(payload: IUpdateCompanyPayload, user: IUser) {
    const cleanPayload: IUpdateCompanyPayload = utils.clean(payload)
    const company = await prisma.company.findUnique({ where: { id: cleanPayload.id } })

    if (!company) {
      throw new ApiError("Company does not exist", 404)
    }

    if (company.ownerId !== user.id) {
      throw new ApiError("You do not have permission to perform this action", 403)
    }

    const data: IUpdateCompanyPayload["company"] = await companySchema.validateAsync(cleanPayload.company)

    if (data.email && data.email !== company.email) {
      const company = await prisma.company.findFirst({ where: { email: data.email } })

      if (company) {
        throw new ApiError("Company email address already exists", 409)
      }
    }

    if (data.phone && data.phone !== company.phone) {
      const company = await prisma.company.findFirst({ where: { phone: data.phone } })

      if (company) {
        throw new ApiError("Company phone number already exists", 409)
      }
    }

    return await prisma.company.update({ where: { id: cleanPayload.id }, data: { ...cleanPayload.company, ...data } })
  }
}
