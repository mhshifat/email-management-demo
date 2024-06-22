import { fetchGmailDocIdsByPageQueue, fetchGoogleEmailsByIds, saveGoogleEmails } from '@/lib';
import './fetchGmailPosts';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

export function Jobs() {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');
  createBullBoard({
    queues: [
      new BullAdapter(fetchGmailDocIdsByPageQueue),
      new BullAdapter(fetchGoogleEmailsByIds),  
      new BullAdapter(saveGoogleEmails),  
    ],
    serverAdapter: serverAdapter,
  });
  
  console.log("Ready to process jobs: -");
  return serverAdapter.getRouter();
}