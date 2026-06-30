import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { createElement } from 'react'
import MailingListConfirmation from './emails/MailingListConfirmation'

class EmailService {
  private transporter: nodemailer.Transporter

  public constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === '1',
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      }
    })
  }

  public async sendMailingListEmail(recipient: string, unsubscribeKey: string): Promise<void> {
    const html = await render(
      createElement(MailingListConfirmation, { email: recipient, unsubscribeKey: unsubscribeKey })
    )

    await this.transporter.sendMail({
      from: "hack@alugatuci.org",
      to: recipient,
      subject: "OpsJam Mailing List Confirmation",
      html,
      text: `Thanks for joining the OpsJam mailing list, ${recipient}.`,
    })
  }
}

const emailService = new EmailService()

export default emailService