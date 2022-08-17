import { request } from "../config";
import { useCompanyStore } from "../stores";

export class CompanyService {
  async loadCompanies() {
    const companyStore = useCompanyStore();

    const companies = await request.api.get("/companies");
    companyStore.setCompanies(companies.data);
  }

  async switchCompany(id) {
    const companyStore = useCompanyStore();
    companyStore.setCompany(id, true);
  }

  async updateCompany(id, data) {
    const companyStore = useCompanyStore();

    const company = await request.api.put(`/companies/${id}`, data);

    companyStore.updateCompany(company.data);
  }

  async addCompany(data) {
    const companyStore = useCompanyStore();

    const company = await request.api.post(`/companies`, data);
    companyStore.updateCompany(company.data);
  }

  async loadCompany(id) {
    const companyStore = useCompanyStore();

    const company = await request.api.get(`/companies/${id}`);
    companyStore.setCompany(company.data);
  }
}
