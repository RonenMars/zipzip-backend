import { ConfigProps } from '@interfaces/config.interface';

export const config = (): ConfigProps => ({
  api: {
    apiUrl: process.env.API_URL,
    httpTimeout: 1000,
  },
  jsonWebToken: process.env.JWT_SECRET,
  port: parseInt(<string>process.env.PORT, 10) || 8080,
  supabase: {
    database: {
      connectionURL: process.env.SUPABASE_API_URL,
      connectionSecret: process.env.SUPABASE_JWT_SECRET,
    },
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
});
