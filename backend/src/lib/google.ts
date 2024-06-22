import { env } from '@/config';
import { google } from 'googleapis';

export const googleClient = new google.auth.OAuth2({
  clientId: env.google.clientId,
  clientSecret: env.google.clientSecret,
  redirectUri: env.google.redirectUri
})
