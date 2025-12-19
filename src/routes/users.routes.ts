import { Router } from 'express';
<<<<<<< HEAD
// import {
// 	deleteUser,
// 	getAllUsers,
// 	getProfile,
// 	// updateProfile,
// 	getUserById,
// 	updateUserProfile,
// 	adminUpdateUser,
// 	getFarmDetails,
// 	getVetAssignedFarms,
// } from '../contollers/users.controllers';
=======
import {
	deleteUser,
	getAllUsers,
	getProfile,
	// updateProfile,
	getUserById,
	updateUserProfile,
	adminUpdateUser,
	getFarmDetails,
	getVetAssignedFarms,
	getAllVets,
} from '../contollers/users.controllers';
>>>>>>> 82cdd2a9a0440413d0b24c05dfc3f01e4a86cfb0
import { authenticateJWT } from '../middlewares/errorHandler';
import { validateRequest } from '../middlewares/validateRequest';
import { adminUpdateUserSchema, changePasswordSchema, updateUserSchema } from '../schemas/users.schemas';
import { requireRoles } from '../middlewares/roleCheck';
import { adminUpdateUser, deleteUser, getAllUsers, getFarmDetails, getProfile, getUserById, getVetAssignedFarms, updateUserProfile } from '../controllers/users.controllers';

export const usersRouter = Router();

usersRouter.get(
	'/profile', 
	authenticateJWT, 
	getProfile
);

usersRouter.patch(
  '/update',
  authenticateJWT,
  validateRequest(updateUserSchema),
  updateUserProfile
);

// usersRouter.patch(
// 	'/update',
// 	authenticateJWT,
// 	validateRequest(updateUserSchema),
// 	updateProfile
// );
 
usersRouter.get(
	'/', 
	authenticateJWT,
	requireRoles(['ADMIN', 'FARM_KEEPER']),
	getAllUsers
);

usersRouter.get(
	'/:userId',
	authenticateJWT,
	requireRoles(['ADMIN', 'FARM_KEEPER']),
	getUserById
);

usersRouter.delete(
	'/:userId', 
	authenticateJWT,
	requireRoles(['ADMIN', 'FARM_KEEPER']),
	deleteUser
);


usersRouter.patch(
  '/:userId',
  authenticateJWT,
  requireRoles(['ADMIN']),
  validateRequest(adminUpdateUserSchema),
  adminUpdateUser
);

usersRouter.get(
	'/vet/assigned-farms', 
	authenticateJWT,
	requireRoles(['VET']),
	getVetAssignedFarms
);

usersRouter.get(
	'/vet/farms/:companyId',
	authenticateJWT,
	requireRoles(['VET', 'ADMIN']),
	getFarmDetails
);

usersRouter.get(
  '/vets/profile',
  authenticateJWT,
  requireRoles(['ADMIN']), 
  getAllVets
);