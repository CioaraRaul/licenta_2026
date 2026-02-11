import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: parseInt(this.configService.get('EMAIL_PORT')),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendResetPasswordEmail(email: string, code: string) {
    const frontendUrl: string = this.configService.get('FRONTEND_URL');
    const resetUrl: string = `${frontendUrl}/auth/reset-password?code=${code}`;

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'RESET YOUR PASSWORD - LICENTA WEB',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #1f2937;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #4b5563;
              margin-bottom: 16px;
            }
            .button {
              display: inline-block;
              padding: 14px 28px;
              background-color: #4f46e5;
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #4338ca;
            }
            .link {
              color: #6b7280;
              word-break: break-all;
              font-size: 14px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 12px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔐 Reset Your Password</h1>
            <p>Hello,</p>
            <p>We received a request to reset your password for your Car Marketplace account.</p>
            <p>Click the button below to reset your password:</p>
            
            <a href="${resetUrl}" class="button">Reset Password</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p class="link">${resetUrl}</p>
            
            <div class="warning">
              <strong>⏰ This link will expire in 1 hour.</strong>
            </div>
            
            <div class="footer">
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p>Best regards,<br>Car Marketplace Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email', error);
      throw error;
    }
  }

  async sendVerificationEmail(email: string, verificationToken: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/auth/verify-email/${verificationToken}`;

    const mailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Verify Your Email - Car Marketplace',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          h1 { color: #1f2937; font-size: 24px; margin-bottom: 20px; }
          p { color: #4b5563; margin-bottom: 16px; }
          .button { display: inline-block; padding: 14px 28px; background-color: #10b981; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
          .link { color: #6b7280; word-break: break-all; font-size: 14px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          .warning { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 12px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✉️ Verify Your Email</h1>
          <p>Hello,</p>
          <p>Thank you for signing up for Car Marketplace! Please verify your email address to activate your account.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${verificationUrl}" class="button">Verify Email</a>
          <div class="warning">
            <strong>⏰ This link will expire in 24 hours.</strong>
          </div>
          <div class="footer">
            <p>If you didn't create an account, please ignore this email.</p>
            <p>Best regards,<br>Car Marketplace Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(' Verification email sent to:', email);
      console.log('Verification URL:', verificationUrl);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error(
        `Failed to send verification email: ${error?.message || error}`,
      );
    }
  }
}
