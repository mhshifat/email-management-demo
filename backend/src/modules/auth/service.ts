import { AuthProvider } from "@/providers/auth";
import { UserService } from "../user";
import { mailProvider } from "@/providers/mail";

export class AuthService {
  private _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  generateAuthUrl(provider: string) {
    const authProvider = new AuthProvider(provider);
    return authProvider.generateAuthUrl();
  }

  async saveUser(provider: string, code: string) {
    const authProvider = new AuthProvider(provider);
    const data = await authProvider.getAccessTokenFromCode(code);
    const user = await this._userService.saveIfNotExist(data);
    mailProvider.getInstance("google").setAuthUserId((user as any)._id).fetchEmails(data.metadata, undefined, undefined, 1);
    return user;
  }
}