import { Router } from 'express';
import { authRouter } from './auth';
import { emailsRouter } from './emails';

export default function Routes() {
  const app = Router();

  app.use("/auth", authRouter);
  app.use("/emails", emailsRouter);

  return app;
}