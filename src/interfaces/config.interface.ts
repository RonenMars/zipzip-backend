interface ApiConfigProps {
  apiUrl?: string;
  httpTimeout: number;
}

interface SupaBaseConfigProps {
  connectionURL?: string;
  connectionSecret?: string;
  databaseName?: string;
}

export interface ConfigProps {
  port: number;
  api: ApiConfigProps;
  supabase: {
    database: SupaBaseConfigProps;
  };
}
