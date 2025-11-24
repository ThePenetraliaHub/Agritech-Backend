"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const errorHandler_1 = require("../middlewares/errorHandler");
const roleCheck_1 = require("../middlewares/roleCheck");
const validateRequest_1 = require("../middlewares/validateRequest");
const task_schemas_1 = require("../schemas/task.schemas");
const upload_1 = require("../config/upload");
const router = (0, express_1.Router)();
router.post('/', errorHandler_1.authenticateJWT, (0, roleCheck_1.requireRoles)(['ADMIN', 'FARM_KEEPER']), (0, validateRequest_1.validateRequest)(task_schemas_1.createTaskSchema), task_controller_1.createTask);
<<<<<<< HEAD
router.post('/:taskId/observations', errorHandler_1.authenticateJWT, upload_1.upload.array('media', 5), (0, validateRequest_1.validateRequest)(task_schemas_1.createTaskObservationSchema), task_controller_1.createTaskObservation);
router.get('/my-tasks', errorHandler_1.authenticateJWT, task_controller_1.getMyTasks);
router.get('/:taskId', errorHandler_1.authenticateJWT, task_controller_1.getTask);
router.patch('/:taskId/status', errorHandler_1.authenticateJWT, (0, validateRequest_1.validateRequest)(task_schemas_1.updateTaskStatusSchema), task_controller_1.updateTaskStatus);
router.get('/assigned/all', errorHandler_1.authenticateJWT, (0, roleCheck_1.requireRoles)(['ADMIN', 'FARM_KEEPER',]), task_controller_1.getAllAssignedTasks);
router.get('/livestocktask/:livestockId', errorHandler_1.authenticateJWT, task_controller_1.getTasksByLivestock);
=======
router.post('/:taskId/observations', errorHandler_1.authenticateJWT, upload_1.upload.array('media', 5), // Max 5 files
(0, validateRequest_1.validateRequest)(task_schemas_1.createTaskObservationSchema), task_controller_1.createTaskObservation);
router.get('/my-tasks', errorHandler_1.authenticateJWT, task_controller_1.getMyTasks);
router.get('/:taskId', errorHandler_1.authenticateJWT, task_controller_1.getTask);
router.patch('/:taskId/status', errorHandler_1.authenticateJWT, (0, validateRequest_1.validateRequest)(task_schemas_1.updateTaskStatusSchema), task_controller_1.updateTaskStatus);
router.get('/assigned/all', errorHandler_1.authenticateJWT, (0, roleCheck_1.requireRoles)(['ADMIN', 'FARM_KEEPER']), task_controller_1.getAllAssignedTasks);
>>>>>>> 7ed02724cb57ed520de649f519d9bcc3b6d7a17e
exports.taskRouter = router;
