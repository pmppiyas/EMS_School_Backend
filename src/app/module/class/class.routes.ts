import { Router } from 'express';
import { ClassController } from './class.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

router.post('/', checkAuth(Role.ADMIN), ClassController.createClass);
router.get('/', ClassController.getClasses);
router.delete('/:id', ClassController.deleteClass);
router.patch('/:id', ClassController.editClass);

// Class Time
router.post('/time', ClassController.addClassTime);
router.get('/time', ClassController.getClassTime);
router.delete('/time/:id', ClassController.deleteClassTime);
router.patch('/time/:id', ClassController.updateClassTime);

export const classRouter = router;
