"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../middlewares/errorHandler");
const validateRequest_1 = require("../middlewares/validateRequest");
const treatment_schemas_1 = require("../schemas/treatment.schemas");
<<<<<<< HEAD
=======
const notification_schemas_1 = require("../schemas/notification.schemas");
const roleCheck_1 = require("../middlewares/roleCheck");
<<<<<<< HEAD
>>>>>>> 9ac435c3ce3d40b6e1c46a4e93ea9dfa5c8a7220
=======
const notification_controller_1 = require("../contollers/notification.controller");
>>>>>>> d568910671b1341a9e8f86b90759f06f1cc4a08e
exports.notificationRouter = (0, express_1.Router)();
// Create diagnosis - VET only
exports.notificationRouter.get('/', errorHandler_1.authenticateJWT, notification_controller_1.getNotifications);
exports.notificationRouter.patch('/:notificationId/status', errorHandler_1.authenticateJWT, (0, validateRequest_1.validateRequest)(treatment_schemas_1.updateNotificationStatusSchema), notification_controller_1.updateNotificationStatus);
exports.notificationRouter.get('/all-notification', errorHandler_1.authenticateJWT, notification_controller_1.getNotificationSettings);
exports.notificationRouter.put('/notification-settings', errorHandler_1.authenticateJWT, (0, validateRequest_1.validateRequest)(notification_schemas_1.updateNotificationSettingsSchema), notification_controller_1.updateNotificationSettings);
exports.notificationRouter.patch('/:settingType/toggle', errorHandler_1.authenticateJWT, notification_controller_1.toggleNotificationSetting);
exports.notificationRouter.post('/:livestockId/weight-update', errorHandler_1.authenticateJWT, (0, roleCheck_1.requireRoles)(['ADMIN']), (0, validateRequest_1.validateRequest)(notification_schemas_1.requestUpdateSchema), notification_controller_1.requestWeightUpdate);
exports.notificationRouter.post('/:livestockId/request-health-update', errorHandler_1.authenticateJWT, (0, roleCheck_1.requireRoles)(['ADMIN', 'FARM_KEEPER', 'COWORKER', 'VET']), (0, validateRequest_1.validateRequest)(notification_schemas_1.requestUpdateSchema), notification_controller_1.requestHealthStatusUpdate);
