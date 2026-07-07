import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { createElement } from 'react'
import MailingListConfirmation from './emails/MailingListConfirmation'
import ApplicationConfirmation from './emails/ApplicationConfirmation'
import { createLogger, maskEmail, serializeError } from './logger'

const logger = createLogger('services/email')

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

    try {
      await this.transporter.sendMail({
        from: "hack@alugatuci.org",
        to: recipient,
        subject: "OpsJam Mailing List Confirmation",
        html,
        text: `Thanks for joining the OpsJam mailing list, ${recipient}.`,
      })
    } catch (error) {
      logger.error('Failed to send mailing list confirmation email', { recipient: maskEmail(recipient), error: serializeError(error) })
      throw error
    }

    logger.info('Mailing list confirmation email sent', { recipient: maskEmail(recipient) })
  }

  // Send a plain admin-authored message to a single recipient. The caller
  // (the broadcast route) fans this out across the whole mailing list, using
  // BCC-style individual sends so recipients don't see each other's addresses.
  public async sendBroadcast(recipient: string, subject: string, message: string): Promise<void> {
    // Render the plain-text message as simple HTML paragraphs. Escape first so
    // any angle brackets in the message can't inject markup, then add <br/>.
    const escape = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const html = message
      .split(/\n{2,}/)
      .map((para) => `<p>${escape(para).replace(/\n/g, '<br/>')}</p>`)
      .join('')

    try {
      await this.transporter.sendMail({
        from: "hack@alugatuci.org",
        to: recipient,
        subject,
        html,
        text: message,
      })
    } catch (error) {
      logger.error('Failed to send broadcast email', { recipient: maskEmail(recipient), error: serializeError(error) })
      throw error
    }

    logger.info('Broadcast email sent', { recipient: maskEmail(recipient) })
  }

  public async sendApplicationConfirmation(recipient: string, appId: number, confirmationCode: string) {
    const html = await render(
      createElement(ApplicationConfirmation, { appId: appId, confirmationCode: confirmationCode })
    )

    try {
      await this.transporter.sendMail({
        from: "hack@alugatuci.org",
        to: recipient,
        subject: "OpsJam Application Confirmation",
        html,
        text: `Confirm your OpsJam application.`,
      })
    } catch (error) {
      logger.error('Failed to send application confirmation email', { recipient: maskEmail(recipient), appId, error: serializeError(error) })
      throw error
    }

    logger.info('Application confirmation email sent', { recipient: maskEmail(recipient), appId })
  }
}

const emailService = new EmailService()

export default emailService