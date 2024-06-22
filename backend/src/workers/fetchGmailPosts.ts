import { fetchGmailDocIdsByPageQueue, fetchGoogleEmailsByIds, saveGoogleEmails } from "@/lib";
import { emailService } from "@/modules";
import { mailProvider } from "@/providers/mail";
import { eventEmitter } from "@/utils/eventEmitter";

fetchGmailDocIdsByPageQueue.process(async (job, done) => {
  try {
    const { nextPage, credentials, totalPages, page, authUserId } = job.data;
    console.log("Job Processing: [fetchGmailDocIdsByPageQueue]");
    await mailProvider.getInstance("google").setAuthUserId(authUserId).fetchEmails(credentials, nextPage, totalPages, page);
    done();
  } catch (error) {
    console.error('Error fetching emails:', error);
    done(error as Error);
  }
});

fetchGoogleEmailsByIds.process(async (job, done) => {
  try {
    const { ids, credentials, totalSize, page, authUserId } = job.data;
    console.log("Job Processing: [fetchGoogleEmailsByIds]");
    const emails = await mailProvider.getInstance("google").setAuthUserId(authUserId).fetchEmailsByIds(credentials, ids);
    await saveGoogleEmails.add({ totalSize, page, emails, authUserId });
    done();
  } catch (error) {
    console.error('Error fetching emails:', error);
    done(error as Error);
  }
});

saveGoogleEmails.process(async (job, done) => {
  try {
    const { totalSize, page, emails, authUserId } = job.data;
    console.log("Job Processing: [saveGoogleEmails]");
    await emailService.updateMany(emails.map((item: Object) => ({ ...item, userId: authUserId })));
    job.progress({ progress: Math.round(((page * 10) / totalSize) * 100) })
    done();
  } catch (error) {
    console.error('Error fetching emails:', error);
    done(error as Error);
  }
});

saveGoogleEmails.on("progress", (_, progress) => {
  console.log({ progress });
  eventEmitter.emit("google_email_sync_progress", progress);
});
