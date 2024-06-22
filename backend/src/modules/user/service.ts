import { mailProvider } from "@/providers/mail";
import { IUser } from "./model";
import { UserRepository } from "./repository";

export class UserService {
  private _repo: UserRepository;
  
  constructor(repo: UserRepository) {
    this._repo = repo;
  }

  async saveIfNotExist<T extends Object>(data: T) {
    const { email } = data as Partial<IUser>
    let user = await this._repo.findOne({ email });
    if (!user) user = await this._repo.save(data);
    else await this._repo.update({ email }, data);
    return user;
  }

  async findUserById(id: string) {
    let user = await this._repo.findOne({ _id: id });
    return user;
  }

  async syncEmails(provider: string, authUserId: string) {
    const user = await this.findUserById(authUserId);
    if (!user) throw new Error("User not found!");
    mailProvider.getInstance(provider).setAuthUserId((user as any)._id).fetchEmails((user as any).metadata, undefined, undefined, 1);
    return user;
  }
}