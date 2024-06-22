import './workers';
import express from 'express';
import cors from 'cors';
import { env } from '@/config';
import Routes from './routes';
import { connectDb } from './lib';
import { Jobs } from './workers';

const app = express();

app.use(cors({
  origin: "*"
}))
app.use("/api/v1", Routes())
app.use('/admin/queues', Jobs());

connectDb()
  .then(() => {
    app.listen(env.port, async () => {
      console.log(`The server is running on port ${env.port}`);
      console.log(`For the UI, open http://localhost:${env.port}/admin/queues`);
      console.log('Make sure Redis is running on port 6379 by default');
    })
  })