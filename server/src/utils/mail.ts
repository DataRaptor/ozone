import Mailgun from "mailgun.js";
import MailgunClient from "mailgun.js/client";
import FormData from "form-data";
import { environment } from "../config";
import path from "path";

export interface ISendData {
  to: string | string[];
  template: string;
  payload: { [key: string]: any };
}

export class Mail {
  private _mailgun: MailgunClient;

  constructor() {
    this._mailgun = new Mailgun(FormData).client({ username: "api", key: environment.mail.mailgun.apiKey });
  }

  async send(data: ISendData) {
    try {
      const { subject, content } = await import(path.resolve(__dirname, "templates", `${data.template}.js`));
      const mailData = {
        from: environment.mail.mailgun.from,
        to: data.to,
        subject: subject,
        html: content(data.payload),
      };

      await this._mailgun.messages.create(environment.mail.mailgun.domain, mailData);
    } catch (e) {
      console.log(e);
    }
  }
}

export const mail = new Mail();
