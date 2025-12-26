import { Router } from 'express';
import { ClassController } from './class.controller';

const router = Router();

router.post('/', ClassController.createClass);
router.get('/', ClassController.getClasses);
router.delete('/:id', ClassController.deleteClass);
router.patch('/:id', ClassController.editClass);

// Class Time
router.post('/time', ClassController.addClassTime);
router.get('/time', ClassController.getClassTime);
router.delete('/time/:id', ClassController.deleteClassTime);
router.patch('/time/:id', ClassController.updateClassTime);

export const classRouter = router;
