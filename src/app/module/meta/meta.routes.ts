import { Router } from 'express';
import { MetaController } from './meta.controller';

const router = Router();

router.get('/student/:id', MetaController.studentMeta);

router.get('/teacher/:id', MetaController.teacherMeta);

export const metaRoutes = router;
