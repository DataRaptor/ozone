export const subject = "Invoice reminder notification";
export function content(data: any) {
  return `
    <p>Hello${data.client ? " " + data.client : ""}</p>
    <p>${data.company} sent you an invoice through Ozone Finance.</p>
    <p>To view the invoice, please click the link: <a href="${data.link}">View invoice</a></p>
    `;
}
