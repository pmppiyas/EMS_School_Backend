import { Router } from 'express';
import { DiaryController } from './diary.controller';

const router = Router();

router.post('/', DiaryController.createDiary);
router.patch('/:id', DiaryController.updateDiary);
router.delete('/:id', DiaryController.deleteDiary);
router.get('/:id', DiaryController.readDiary);

export const diaryRoutes = router;
