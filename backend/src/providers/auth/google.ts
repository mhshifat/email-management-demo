import { env } from "@/config";
import { IAuthProvider } from ".";
import { googleClient } from "@/lib";
import { google } from "googleapis";

export class GoogleProvide implements IAuthProvider {
  constructor() {
    if (!env.google.clientId) throw new Error("Google client Id is required");
    if (!env.google.clientSecret) throw new Error("Google client secret is required");
  }

  async generateAuthUrl() {
    return googleClient.generateAuthUrl({
      access_type: "offline",
      state: "",
      scope: env.google.scopes?.split(",")
    })
  }

  async getAccessTokenFromCode(code: string) {
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);
    const googleOAuthClient = google.oauth2({
      version: "v2",
      auth: googleClient
    });
    const { data } = await googleOAuthClient.userinfo.get(); 
    return {
      email: data.email,
      fullName: data.name,
      firstName: data.given_name,
      lastName: data.family_name,
      metadata: JSON.stringify(tokens),
    };
  }
}