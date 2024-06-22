import { env } from '@/config';
import { emailService, userService } from '@/modules';
import { Router } from 'express';
import { eventEmitter } from './../utils/eventEmitter';

export const emailsRouter = Router();

emailsRouter
  .route("/:provider/sync")
  .get(async (req, res) => {
    const { provider } = req.params;
    const { uid } = req.query;
    
    userService.syncEmails(provider, uid as string);
    res.json({ message: "Synching..." });
  });

emailsRouter
  .route("/:provider/:emailId/mark-as-read")
  .post(async (req, res) => {
    const { provider, emailId } = req.params;
    const { uid } = req.query;
    
    await emailService.markAsRead(provider, emailId, uid as string);
    res.json({ message: "Marked as read" });
  });

emailsRouter
  .route("/:provider")
  .get(async (req, res) => {
    const { provider } = req.params;
    const { uid } = req.query;
    
    const emails = await emailService.findEmailsByUserId(provider, uid as string);
    res.json({
      data: emails
    });
  });

emailsRouter
  .route("/:provider/sync/progress")
  .get(async (req, res) => {
    const { provider } = req.params;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const eventHandler = (data: any) => {
      res.write(`data: ${data?.progress}\n\n`);
    }

    eventEmitter.on(`${provider}_email_sync_progress`, eventHandler);

    req.on('close', () => {
      eventEmitter.off(`${provider}_email_sync_progress`, eventHandler);
      res.end();
    });
  });