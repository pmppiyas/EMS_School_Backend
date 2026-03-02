import { Router } from 'express';
import { AuthController } from './auth.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.post('/login', AuthController.crdLogin);
router.get('/me', AuthController.getMe);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

router.patch(
  '/change-password',
  checkAuth(...Object.values(Role)),
  AuthController.changePassword
);

router.patch(
  '/change-email',
  checkAuth(...Object.values(Role)),
  AuthController.changeEmail
);

export const authRoutes = router;
