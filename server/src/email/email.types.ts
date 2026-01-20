export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailService {
  sendOTPEmail(email: string, otp: string, userName: string): Promise<void>;
  sendVerificationEmail(email: string, userName: string): Promise<void>;
  sendRejectionEmail(email: string, userName: string, reason: string): Promise<void>;
  sendAdminNotification(contact: ContactEmailData): Promise<void>;
  sendUserConfirmation(contact: ContactEmailData): Promise<void>;
  verifyConfig(): Promise<boolean>;
}

export interface ContactEmailData {
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date;
}