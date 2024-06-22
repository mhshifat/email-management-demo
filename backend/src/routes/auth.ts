import { env } from '@/config';
import { authService } from '@/modules';
import { Router } from 'express';

export const authRouter = Router();

authRouter
  .route("/:path")
  .get(async (req, res) => {
    const path = req.params.path;
    const url = await authService.generateAuthUrl(path);
    res.redirect(url);
  });

authRouter
  .route("/:path/callback")
  .get(async (req, res) => {
    const { path } = req.params;
    const { code } = req.query;
    const user = await authService.saveUser(path, code as string);
    res.redirect(`${env.webUri}?uid=${(user as any)._id}`);
  });