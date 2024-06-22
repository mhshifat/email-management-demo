import { GoogleMailProvider } from "./google";

export interface IMailProvider {
  fetchEmails(credentials: string): Promise<unknown>;
  markEmailAsRead(credentials: string, messageId: string): Promise<unknown>;
  watchMailbox(credentials: string): Promise<unknown>;
}

export class MailProvider {
  getInstance(provider: string) {
    const providers = {
      "google": new GoogleMailProvider()
    }

    return providers[provider as keyof typeof providers];
  }
}

export const mailProvider = new MailProvider();