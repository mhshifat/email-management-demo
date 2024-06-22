import { Schema, model, connect } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  metadata: string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  metadata: { type: String, required: true },
});

export const User = model<IUser>('User', userSchema);