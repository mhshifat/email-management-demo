import { mailProvider } from "@/providers/mail";
import { IEmail } from "./model";
import { EmailRepository } from "./repository";
import { userService } from "..";

export class EmailService {
  private _repo: EmailRepository;
  
  constructor(repo: EmailRepository) {
    this._repo = repo;
  }

  async findEmailsByUserId(provider: string, uid: string) {
    return await this._repo.find({
      userId: uid,
      type: provider
    })
  }

  async markAsRead(provider: string, emailId: string, uid: string) {
    const email = await this._repo.findOne({ _id: emailId, userId: uid, type: provider });
    if (!email) throw new Error("Email not found!");
    const user = await userService.findUserById(uid);
    if (!user) throw new Error("User not found!");
    await mailProvider.getInstance(provider).setAuthUserId(uid).markEmailAsRead((user as any).metadata, (email as any).messageId);
    await this._repo.update({ _id: emailId }, { isRead: true });
  }

  async updateMany<T extends Object>(data: T[]) {
    await this._repo.bulkWrite(data.map(item => ({
      where: { subject: (item as unknown as IEmail).subject, type: (item as unknown as IEmail).type },
      data: item
    })))
  }
}