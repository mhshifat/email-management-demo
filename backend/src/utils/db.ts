export abstract class Database {
  abstract find<T extends Object>(where: Record<string, unknown>): Promise<T[]>;
  abstract findOne<T extends Object>(where: Record<string, unknown>): Promise<T>;
  abstract save<T extends Object>(data: T): Promise<T>;
  abstract update<T extends Object>(where: Record<string, unknown>, data: T): Promise<T>;
  abstract bulkWrite<T extends Object>(data: {
      where: Record<string, unknown>;
      data: T;
  }[]): Promise<void>;
}