import { Router } from 'express';
import {
  addLivestock,
  updateLivestock,
  deleteLivestock,
  getAllLivestock,
  getLivestockCounts,
  softDeleteLivestock,
  getDeletedLivestock,
  restoreLivestock,
  getLivestockById,
  getFarmLivestock,
  getLivestockHealthHistory,
  getLivestockActivityTimeline,
<<<<<<< HEAD
} from '../controllers/livestock.controller';
=======
  getLivestockByCompany,
} from '../contollers/livestock.controller';
>>>>>>> 1ad2da4ca5b21585f4635dfd7fede0c020b7c2c0
import { authenticateJWT } from '../middlewares/errorHandler';
import { validateRequest } from '../middlewares/validateRequest';
import {
  addLivestockSchema,
  deleteLivestockSchema,
  updateLivestockSchema,
} from '../schemas/livestock.schemas';
import { requireRoles } from '../middlewares/roleCheck';


export const livestockRouter = Router();

livestockRouter.post(
  '/:companyId',
  authenticateJWT,
  validateRequest(addLivestockSchema),
  addLivestock
);

livestockRouter.get(
  '/counts',
  authenticateJWT,
  getLivestockCounts
)

livestockRouter.get(
  '/',
  authenticateJWT, 
  getAllLivestock
);

// used by vet to get livestock of a farm
livestockRouter.get(
  '/:companyId',
  authenticateJWT,
  getLivestockByCompany
);

livestockRouter.get(
  '/:livestockId', 
  authenticateJWT, 
  getLivestockById
);

livestockRouter.patch(
  '/:livestockId',
  authenticateJWT,
  validateRequest(updateLivestockSchema),
  updateLivestock
);


livestockRouter.delete(
  '/:livestockId', 
  authenticateJWT, 
  requireRoles(['ADMIN', 'FARM_KEEPER']),
  deleteLivestock
);

// softdelete livestock 
livestockRouter.delete(
  '/:livestockId/soft-delete',
  authenticateJWT,
  validateRequest(deleteLivestockSchema),
  softDeleteLivestock
);

// Admin-only routes
livestockRouter.get(
  '/deleted/all',
  authenticateJWT,
  requireRoles(['ADMIN']),
  getDeletedLivestock
);

livestockRouter.get(
  '/:livestockId/health-history',
  authenticateJWT,
  getLivestockHealthHistory
);

livestockRouter.get(
  '/:livestockId/activity-timeline',
  authenticateJWT,
  getLivestockActivityTimeline
);

livestockRouter.patch(
  '/:livestockId/restore',
  authenticateJWT,
  requireRoles(['ADMIN']),
  restoreLivestock
);

livestockRouter.get(
  '/vet/farm/:companyId',
  authenticateJWT,
  requireRoles(['VET']),
  getFarmLivestock
);