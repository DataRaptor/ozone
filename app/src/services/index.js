import { AuthService } from "./auth"
import { ClientService } from "./client"
import { AddressService } from "./address"
import { CompanyService } from "./company"
import { TokenService } from "./token"
import { InvoiceService } from "./invoice"

export const authService = new AuthService()
export const clientService = new ClientService()
export const addressService = new AddressService()
export const companyService = new CompanyService()
export const tokenService = new TokenService()
export const invoiceService = new InvoiceService()
