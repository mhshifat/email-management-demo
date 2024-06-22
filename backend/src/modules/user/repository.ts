import { Database } from "@/utils/db";
import { User } from "./model";

export class UserRepository extends Database {
  
  async findOne<T extends Object>(where: Record<string, unknown>): Promise<T> {
    const user = await User.findOne(where);
    return user as unknown as T;
  }

  async find<T extends Object>(where: Record<string, unknown>): Promise<T[]> {
    const users = await User.find(where);
    return users as unknown as T[];
  }

  async save<T extends Object>(data: T): Promise<T> {
    const user = await User.create(data);
    return user as unknown as T;
  }

  async update<T extends Object>(where: Record<string, unknown>, data: T): Promise<T> {
    const user = await User.findOneAndUpdate(where, data);
    return user as unknown as T;
  }

  async bulkWrite<T extends Object>(data: { where: Record<string, unknown>, data: T }[]): Promise<void> {
    await User.bulkWrite(data.map(item => ({
      'updateOne': {
        'filter': item.where,
        'update': { '$set': item.data },
        'upsert': true,
      }
    })));
  }
}