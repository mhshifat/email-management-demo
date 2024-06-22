import { fetchGmailDocIdsByPageQueue, fetchGoogleEmailsByIds, googleClient } from "@/lib";
import { google } from "googleapis";
import { IMailProvider } from ".";

export class GoogleMailProvider implements IMailProvider {
  private authUserId: string | undefined;

  setAuthUserId(userId: string) {
    this.authUserId = userId;

    return this;
  }

  private async fetchTotalNumberOfEmails(credentials: string) {
    try {
      const parsed = JSON.parse(credentials || "{}");
      googleClient.setCredentials(parsed);
      const gmail = google.gmail({
        version: 'v1', 
        auth: googleClient
      });
      
      let total = 0;
      async function fetchResults(nextPage?: string) {
        const { data } = await gmail.users.messages.list({
          userId: "me",
          maxResults: 10,
          pageToken: nextPage
        });
        total += data.messages?.length || 0;
        if (data.nextPageToken) await fetchResults(data.nextPageToken);
        return total;
      }
      total = await fetchResults();
      return total;
    } catch (err) {
      console.log(err);
    }
  }

  async fetchEmails(credentials: string, nextPage?: string | undefined, total?: number, page?: number) {
    try {
      const parsed = JSON.parse(credentials || "{}");
      googleClient.setCredentials(parsed);
      const gmail = google.gmail({
        version: 'v1', 
        auth: googleClient
      });
      const totalPages = !nextPage ? await this.fetchTotalNumberOfEmails(credentials) : total;
      const { data } = await gmail.users.messages.list({
        userId: "me",
        maxResults: 10,
        pageToken: nextPage
      });

      if (data.nextPageToken) {
        await fetchGmailDocIdsByPageQueue.add({ authUserId: this.authUserId, nextPage: data.nextPageToken, credentials, totalPages, page: (page || 0) + 1 });
      }

      await fetchGoogleEmailsByIds.add({ credentials, ids: data.messages?.map(({ id }) => id), totalSize: totalPages, page, authUserId: this.authUserId });
    } catch (err) {
      console.log(err);
    }
  }

  async fetchEmailsByIds(credentials: string, ids: string[]) {
    const parsed = JSON.parse(credentials || "{}");
    googleClient.setCredentials(parsed);
    const gmail = google.gmail({
      version: 'v1', 
      auth: googleClient
    });
    const emails = await Promise.all(ids.map(async (id) => {
      const { data } = await  gmail.users.messages.get({
        userId: 'me',
        id: id,
      });

      const headers = data?.payload?.headers?.reduce((acc, header) => {
        (acc as any)[header?.name?.toLowerCase() || ""] = header.value;
        return acc;
      }, {}) as any;
    
      const subject = headers?.['subject'] || '';
      const from = headers?.['from'] || '';
      const to = headers?.['to'] || '';
      const cc = headers?.['cc'] || '';
      const bcc = headers?.['bcc'] || '';
      const receivedDateTime = headers?.['date'] || '';
      const isRead = data?.labelIds?.includes('UNREAD') ? false : true;
      const isFlagged = data?.labelIds?.includes('STARRED') ? true : false;
      let body = '';
    
      if (data?.payload?.parts) {
        const part = data?.payload.parts.find(part => part.mimeType === 'text/plain');
        if (part && part.body && part.body.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      } else if (data?.payload?.body && data?.payload.body.data) {
        body = Buffer.from(data?.payload.body.data, 'base64').toString('utf-8');
      }
    
      return { messageId: id, subject, from, to, cc, bcc, receivedDateTime, isRead, isFlagged, body, type: "google" };
    }));

    return emails;
  }

  async markEmailAsRead(credentials: string, messageId: string) {
    const parsed = JSON.parse(credentials || "{}");
    googleClient.setCredentials(parsed);
    const gmail = google.gmail({
      version: 'v1', 
      auth: googleClient
    });
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['UNREAD'],
      },
    });
  }

  async watchMailbox(credentials: string) {
    const parsed = JSON.parse(credentials || "{}");
    googleClient.setCredentials(parsed);
    const gmail = google.gmail({
      version: 'v1', 
      auth: googleClient
    });
    return gmail.users.watch({
      userId: 'me',
      requestBody: {
        labelIds: ['INBOX'],
        topicName: 'projects/YOUR_PROJECT_ID/topics/YOUR_TOPIC_NAME'
      },
    });
  }
}