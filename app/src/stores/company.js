import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"

export const useCompanyStore = defineStore("Company", {
  state: () => ({ currentId: useLocalStorage("company", null), companies: [], company: {} }),

  actions: {
    addCompany(company) {
      this.companies = [company, ...this.companies]
    },

    setCompanies(companies) {
      this.companies = companies
      this.setCompany(companies[0])
    },

    updateCompany(value) {
      const company = this.companies.find((c) => c.id === value.id)
      if (!!company) {
        Object.assign(company, value)
      }

      this.setCompany(value)
    },

    setCompany(company) {
      if (company) {
        this.company = company

        if (!this.currentId) {
          this.currentId = company.id
        }
      }
    },
  },
})
