import { GoogleProvide } from "./google";

export interface IAuthProvider {
  generateAuthUrl(): Promise<string>;
  getAccessTokenFromCode(code: string): Promise<{
    email: string | null | undefined;
    fullName: string | null | undefined;
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    metadata: string;
  }>;
}

export class AuthProvider implements IAuthProvider {
  _provider: IAuthProvider;
  
  constructor(provider: string) {
    const providers = {
      "google": new GoogleProvide(),
    }

    this._provider = providers[provider as keyof typeof providers];
  }

  async generateAuthUrl() {
    return this._provider.generateAuthUrl();
  }

  async getAccessTokenFromCode(code: string) {
    return this._provider.getAccessTokenFromCode(code);
  }
}
