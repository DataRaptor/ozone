export const subject = "Invoice notification";
export function content(data: any) {
  return `
    <p>Hello${data.client ? " " + data.client : ""}</p>
    <p>${data.company} just sent you an invoice through Ozone Finance.</p>
    <p>To view the invoice, please click the link: <a href="${data.link}">View invoice</a></p>
    `;
}
