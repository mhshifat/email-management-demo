import { Schema, model } from 'mongoose';

export interface IEmail {
  userId: string;
  messageId: string;
  type: string;
  subject: string;
  from: string;
  to: string;
  cc: string;
  bcc: string;
  receivedDateTime: string;
  isRead: boolean;
  isFlagged: boolean;
  body: string;
}

const emailSchema = new Schema<IEmail>({
  userId: { type: String, required: true },
  messageId: { type: String, required: true },
  type: { type: String, required: true },
  subject: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  cc: { type: String, required: true },
  bcc: { type: String, required: true },
  receivedDateTime: { type: String, required: true },
  body: { type: String, required: true },
  isRead: { type: Boolean, required: true },
  isFlagged: { type: Boolean, required: true },
});

export const Email = model<IEmail>('Email', emailSchema);