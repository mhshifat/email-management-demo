import { Database } from "@/utils/db";
import { Email } from "./model";

export class EmailRepository extends Database {
  
  async findOne<T extends Object>(where: Record<string, unknown>): Promise<T> {
    const email = await Email.findOne(where);
    return email as unknown as T;
  }
  
  async find<T extends Object>(where: Record<string, unknown>): Promise<T[]> {
    const emails = await Email.find(where);
    return emails as unknown as T[];
  }

  async save<T extends Object>(data: T): Promise<T> {
    const email = await Email.create(data);
    return email as unknown as T;
  }

  async update<T extends Object>(where: Record<string, unknown>, data: T): Promise<T> {
    const email = await Email.findOneAndUpdate(where, data);
    return email as unknown as T;
  }

  async bulkWrite<T extends Object>(data: { where: Record<string, unknown>, data: T }[]): Promise<void> {
    await Email.bulkWrite(data.map(item => ({
      'updateOne': {
        'filter': item.where,
        'update': { '$set': item.data },
        'upsert': true,
      }
    })));
  }
}