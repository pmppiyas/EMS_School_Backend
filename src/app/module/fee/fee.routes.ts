import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';
import { FeeControllers } from './fee.controller';

const router = Router();

router.post('/', checkAuth(Role.ADMIN), FeeControllers.createFee);
router.get('/', FeeControllers.getAllFee);
router.get('/my', checkAuth(Role.STUDENT), FeeControllers.myFee);

router.get(
  '/paid-fees/:id',
  checkAuth(...Object.values(Role)),
  FeeControllers.paidFees
);

// Fee types
router.post(
  '/type',
  checkAuth(Role.ADMIN, Role.TEACHER),
  FeeControllers.createFeeType
);

router.delete(
  '/type/:id',
  checkAuth(Role.ADMIN, Role.TEACHER),
  FeeControllers.deleteFeeType
);

router.get('/type', FeeControllers.getAllfeeType);

export const feeRoutes = router;
