interface ApiConfigProps {
  apiUrl?: string;
  httpTimeout: number;
}

interface SupaBaseConfigProps {
  connectionURL?: string;
  connectionSecret?: string;
  databaseName?: string;
}

interface TwilioBaseConfigProps {
  accountSid?: string;
  authToken?: string;
  phoneNumber?: string;
}

export interface ConfigProps {
  port: number;
  jsonWebToken: string;
  api: ApiConfigProps;
  supabase: {
    database: SupaBaseConfigProps;
  };
  twilio: TwilioBaseConfigProps;
}
