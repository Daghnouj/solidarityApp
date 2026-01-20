import { createTransport, Transporter } from 'nodemailer';
import { env } from '../../config/env';
import { EmailService, EmailOptions, ContactEmailData } from './email.types';
import { EmailTemplates } from './email.templates';

export class EmailServiceImpl implements EmailService {
  private transporter: Transporter;
  private from: string;

  constructor() {
    this.from = `"Solidarity" <${env.EMAIL_USER}>`;
    
    this.transporter = createTransport({
      service: "gmail",
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: options.from || this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email sent to ${options.to}`);
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
  }

  public async sendOTPEmail(email: string, otp: string, userName: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "OTP pour réinitialisation du mot de passe - Solidarity",
      html: EmailTemplates.generateOTPEmail(userName, otp),
    });
  }

  public async sendVerificationEmail(email: string, userName: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Validation de votre compte professionnel - Solidarity",
      html: EmailTemplates.generateVerificationEmail(userName),
    });
  }

  public async sendRejectionEmail(email: string, userName: string, reason: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Compte professionnel non validé - Solidarity",
      html: EmailTemplates.generateRejectionEmail(userName, reason),
    });
  }

  public async sendAdminNotification(contact: ContactEmailData): Promise<void> {
    await this.sendEmail({
      to: env.EMAIL_USER,
      subject: `Nouveau contact: ${contact.subject}`,
      html: EmailTemplates.generateAdminNotificationEmail(contact),
    });
  }

  public async sendUserConfirmation(contact: ContactEmailData): Promise<void> {
    await this.sendEmail({
      to: contact.email,
      subject: `Confirmation: ${contact.subject}`,
      html: EmailTemplates.generateUserConfirmationEmail(contact),
    });
  }

  public async verifyConfig(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email transporter configured successfully');
      return true;
    } catch (error) {
      console.error('❌ Email configuration error:', error);
      return false;
    }
  }
}

export const emailService = new EmailServiceImpl();