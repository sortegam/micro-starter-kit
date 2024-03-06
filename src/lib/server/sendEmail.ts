import {
  MAIL_TRANSPORTER,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  MAIL_FAKE_SMTP_PASSWORD,
  MAIL_FAKE_SMTP_PORT,
  MAIL_FAKE_SMTP_SERVER,
  MAIL_FAKE_SMTP_USER,
  MAIL_FAKE_SMTP_USE_TLS,
  MAIL_FROM_ADDRESS,
  MAIL_SMTP_SERVER,
  MAIL_SMTP_PORT,
  MAIL_SMTP_USER,
  MAIL_SMTP_PASSWORD,
  MAIL_SMTP_USE_TLS,
} from '$env/static/private';
import * as aws from '@aws-sdk/client-ses';
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

switch (MAIL_TRANSPORTER) {
  // #################################################################
  // # AWS SES TRANSPORTER DEFINITION
  // #################################################################
  case 'AWS-SES': {
    const ses = new aws.SES({
      region: AWS_REGION,
      apiVersion: '2010-12-01',
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // create Nodemailer SES transporter
    transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });
    break;
  }
  // #################################################################
  // # FAKE SMTP TRANSPORTER DEFINITION
  // #################################################################
  case 'FAKE_SMTP': {
    transporter = nodemailer.createTransport(
      {
        host: MAIL_FAKE_SMTP_SERVER,
        port: parseInt(MAIL_FAKE_SMTP_PORT, 10),
        secure: Boolean(MAIL_FAKE_SMTP_USE_TLS.match(/true/i)),
        auth: {
          type: 'login',
          user: MAIL_FAKE_SMTP_USER,
          pass: MAIL_FAKE_SMTP_PASSWORD,
        },
      },
      {
        from: MAIL_FROM_ADDRESS,
      }
    );
    break;
  }
  // #################################################################
  // # DEFAULT SMTP TRANSPORTER DEFINITION
  // #################################################################
  case 'SMTP':
  default: {
    transporter = nodemailer.createTransport(
      {
        host: MAIL_SMTP_SERVER,
        port: parseInt(MAIL_SMTP_PORT, 10),
        secure: Boolean(MAIL_SMTP_USE_TLS.match(/true/i)),
        auth: {
          type: 'login',
          user: MAIL_SMTP_USER,
          pass: MAIL_SMTP_PASSWORD,
        },
      },
      {
        from: MAIL_FROM_ADDRESS,
      }
    );
  }
}

export const emailSender = transporter;
