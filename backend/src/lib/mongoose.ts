import { env } from '@/config';
import mongoose from 'mongoose'

export const connectDb = async () => {
  try {
    await mongoose.connect(env.databaseUri);
  } catch (error) {
    console.error(error);
  }
}