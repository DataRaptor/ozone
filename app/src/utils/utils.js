import * as dateFns from "date-fns"

export const utils = {
  formatDate(date, format = "dd MMM yyyy") {
    date = !!date ? new Date(date) : new Date()
    return dateFns.format(date, format)
  },

  addDays(date, days) {
    date = !!date ? new Date(date) : new Date()
    return dateFns.addDays(date, days)
  },
}
