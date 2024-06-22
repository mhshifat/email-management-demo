import { redisConfiguration } from '@/config';
import Queue from 'bull';

export const fetchGmailDocIdsByPageQueue = new Queue("FETCH_GMAIL_IDS_BY_PAGE", { redis: redisConfiguration });
export const fetchGoogleEmailsByIds = new Queue("FETCH_GOOGLE_EMAILS_BY_IDS", { redis: redisConfiguration });
export const saveGoogleEmails = new Queue("SAVE_GOOGLE_EMAILS_", { redis: redisConfiguration });
