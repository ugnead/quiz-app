import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deactivateUser,
} from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.patch('/:userId/role', updateUserRole);
router.patch('/:userId/deactivate', deactivateUser);

export default router;
