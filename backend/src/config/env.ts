import 'dotenv/config';

export const env = {
  port: process.env.PORT || 8000,
  webUri: process.env.WEB_URI,
  serverUri: process.env.SERVER_URI,
  databaseUri: process.env.DATABASE_URL || "",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scopes: process.env.GOOGLE_SCOPES,
    get redirectUri() {
      return `${env.serverUri}${process.env.GOOGLE_REDIRECT_PATH}`
    }
  }
} 