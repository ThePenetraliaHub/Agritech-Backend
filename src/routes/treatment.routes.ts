import { Router } from 'express';
import { authenticateJWT } from '../middlewares/errorHandler';
import { requireRoles } from '../middlewares/roleCheck';
import { validateRequest } from '../middlewares/validateRequest';
import { prescribeTreatmentSchema, recordTreatmentSchema, scheduleFollowUpSchema } from '../schemas/treatment.schemas';
import { getAllTreatments, getTreatmentById, prescribeTreatment, recordTreatment, scheduleFollowUp } from '../controllers/treatment.controller';

export const treatmentRouter = Router();

treatmentRouter.get(
  '/',
  authenticateJWT,
  getAllTreatments
);

treatmentRouter.get(
  '/:treatmentId',
  authenticateJWT,
  getTreatmentById
);

treatmentRouter.post(
  '/livestock/:livestockId',
  authenticateJWT,
  requireRoles(['ADMIN', 'FARM_KEEPER', 'COWORKER', 'VET']),
  validateRequest(recordTreatmentSchema),
  recordTreatment
);


treatmentRouter.post(
  '/:livestockId/prescribe',
  authenticateJWT,
  validateRequest(prescribeTreatmentSchema),
  prescribeTreatment
);

// Schedule follow-up - VET only
treatmentRouter.post(
  '/follow-ups',
  authenticateJWT,
  validateRequest(scheduleFollowUpSchema),
  scheduleFollowUp
);

// treatmentRouter.get(
//   '/livestock/:livestockId/follow-ups',
//   authenticateJWT,
//   getFollowUps
// );

// // Update follow-up status
// treatmentRouter.patch(
//   '/follow-ups/:followUpId/status',
//   authenticateJWT,
//   updateFollowUpStatus
// );

// route for treatment linked to specific sickness
// treatmentRouter.post(
//   '/livestock/:livestockId/sickness/:sicknessId/treatment',
//   authenticateJWT,
//   requireRoles(['ADMIN', 'FARM_KEEPER', 'VET']),
//   validateRequest(recordTreatmentSchema),
//   recordTreatment
// );