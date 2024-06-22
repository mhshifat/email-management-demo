import { AuthService } from "./auth";
import { EmailRepository } from "./emails/repository";
import { EmailService } from "./emails/service";
import { UserRepository, UserService } from "./user";

// User
export const userRepository = new UserRepository();
export const userService = new UserService(userRepository);

// Email
export const emailRepository = new EmailRepository();
export const emailService = new EmailService(emailRepository);

// Auth
export const authService = new AuthService(
  userService
);