/**
 * Configuration properties for the API.
 */
interface ApiConfigProps {
  apiUrl?: string; // The API URL, if provided.
  httpTimeout: number; // The HTTP request timeout value in milliseconds.
}

/**
 * Configuration properties for Supabase.
 */
interface SupaBaseConfigProps {
  connectionURL?: string; // The Supabase API connection URL, if provided.
  connectionSecret?: string; // The Supabase API connection secret, if provided.
  databaseName?: string; // The name of the Supabase database, if provided.
}

/**
 * Configuration properties for Twilio.
 */
interface TwilioBaseConfigProps {
  accountSid?: string; // The Twilio account SID, if provided.
  authToken?: string; // The Twilio authentication token, if provided.
  phoneNumber?: string; // The Twilio phone number, if provided.
}

/**
 * Configuration object containing various properties.
 */
export interface ConfigProps {
  port: number; // The port on which the application should listen.
  jsonWebToken: string; // The JSON Web Token (JWT) secret.
  frontendURL: string; // The JSON Web Token (JWT) secret.
  api: ApiConfigProps; // API configuration properties.
  supabase: {
    database: SupaBaseConfigProps; // Supabase database configuration properties.
  };
  twilio: TwilioBaseConfigProps; // Twilio configuration properties.
}
