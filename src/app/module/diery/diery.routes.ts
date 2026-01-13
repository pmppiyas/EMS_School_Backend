import { Router } from 'express';
import { DieryController } from './diery.controller';

const router = Router();

router.post('/', DieryController.createDiery);
router.patch('/id', DieryController.updateDiery);
router.delete('/id', DieryController.deleteDiery);
router.get('/id', DieryController.readDiery);

export const dieryRoutes = router;
