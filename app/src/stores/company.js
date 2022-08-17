import { thawAccountInstructionData } from "@solana/spl-token";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const useCompanyStore = defineStore("Company", {
  state: () => ({ currentId: useLocalStorage("company", null), companies: [], company: {} }),

  actions: {
    addCompany(company) {
      this.companies = [company, ...this.companies];
    },

    setCompanies(companies) {
      this.companies = companies;

      this.setCompany(companies[0]);
    },

    updateCompany(value) {
      const company = this.companies.find((c) => c.id === value.id);
      if (!!company) {
        Object.assign(company, value);
      } else {
        this.companies = [value, ...this.companies];
      }

      this.setCompany(value, true);
    },

    setCompany(company, force = false) {
      if (company) {
        if (typeof company === "string") {
          company = this.companies.find((c) => c.id === company);
        }
        this.company = company;

        if (force) {
          this.currentId = company.id;
        } else {
          const current = this.companies.find((c) => c.id === this.currentId);
          if (!current) {
            this.currentId = company.id;
          } else {
            this.company = current;
          }
        }
      }
    },
  },
});
