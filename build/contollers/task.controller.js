"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskObservation = exports.getAllAssignedTasks = exports.updateTaskStatus = exports.getTask = exports.getMyTasks = exports.createTask = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const sendSuccessResponse_1 = require("../utils/sendSuccessResponse");
const NotFoundError_1 = require("../errors/NotFoundError");
const ForbiddenError_1 = require("../errors/ForbiddenError");
const selects_1 = require("../prisma/selects");
const upload_1 = require("../config/upload");
const createTask = async (req, res, next) => {
    try {
        const { name, description, priority, dueDate, assignedToId } = req.body;
        const assignedById = req.user.id;
        const assignedByRole = req.user.role;
        // Check if assignee exists
        const assignee = await prisma_1.default.user.findUnique({
            where: { id: assignedToId },
            select: { role: true }
        });
        if (!assignee) {
            throw new NotFoundError_1.NotFoundError('Assignee not found');
        }
        // Validate assignment permissions
        if (assignedByRole === 'FARM_KEEPER' && assignee.role !== 'COWORKER') {
            throw new ForbiddenError_1.ForbiddenError('Farm keepers can only assign tasks to coworkers');
        }
        if (assignedByRole === 'ADMIN' && !['FARM_KEEPER', 'COWORKER'].includes(assignee.role)) {
            throw new ForbiddenError_1.ForbiddenError('Admins can only assign tasks to farm keepers or coworkers');
        }
        const task = await prisma_1.default.task.create({
            data: {
                name,
                description,
                priority,
                dueDate: new Date(dueDate),
                status: 'PENDING',
                assignedToId,
                assignedById
            },
            include: {
                assignedTo: { select: selects_1.userSelect },
                assignedBy: { select: selects_1.userSelect }
            }
        });
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Task created successfully', { task }, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const getMyTasks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;
        const where = {
            assignedToId: userId,
            ...(status && { status: status })
        };
        const [tasks, total] = await Promise.all([
            prisma_1.default.task.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { dueDate: 'asc' },
                include: {
                    assignedBy: {
                        select: {
                            id: true,
                            fullName: true,
                            role: true
                        }
                    }
                }
            }),
            prisma_1.default.task.count({ where })
        ]);
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Tasks retrieved successfully', {
            tasks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyTasks = getMyTasks;
const getTask = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.taskId;
        const task = await prisma_1.default.task.findFirst({
            where: {
                id: taskId,
                assignedToId: userId // Ensures the task belongs to the user
            },
            include: {
                assignedBy: { select: selects_1.userSelect }
            }
        });
        if (!task) {
            throw new NotFoundError_1.NotFoundError('Task not found');
        }
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Task retrieved successfully', { task });
    }
    catch (error) {
        next(error);
    }
};
exports.getTask = getTask;
const updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const taskId = req.params.taskId;
        const userId = req.user.id;
        // Verify task exists and belongs to user
        const task = await prisma_1.default.task.findUnique({
            where: { id: taskId }
        });
        if (!task) {
            throw new NotFoundError_1.NotFoundError('Task not found');
        }
        if (task.assignedToId !== userId) {
            throw new ForbiddenError_1.ForbiddenError('You can only update your own tasks');
        }
        const updatedTask = await prisma_1.default.task.update({
            where: { id: taskId },
            data: { status },
            include: {
                assignedTo: { select: selects_1.userSelect },
                assignedBy: { select: selects_1.userSelect }
            }
        });
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Task status updated successfully', { task: updatedTask });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTaskStatus = updateTaskStatus;
const getAllAssignedTasks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { status, page = 1, limit = 10 } = req.query;
        const where = {
            ...(status && { status: status })
        };
        // Role-specific filtering
        if (userRole === 'FARM_KEEPER') {
            // Farm keepers can only see tasks they've assigned or tasks assigned to their coworkers
            where.OR = [
                { assignedById: userId },
                {
                    assignedTo: {
                        role: 'COWORKER',
                    }
                }
            ];
        }
        // Admin can see all tasks (no additional filtering needed)
        const [tasks, total] = await Promise.all([
            prisma_1.default.task.findMany({
                where,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                orderBy: { dueDate: 'asc' },
                include: {
                    assignedTo: {
                        select: {
                            id: true,
                            fullName: true,
                            role: true
                        }
                    },
                    assignedBy: {
                        select: {
                            id: true,
                            fullName: true,
                            role: true
                        }
                    }
                }
            }),
            prisma_1.default.task.count({ where })
        ]);
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Assigned tasks retrieved successfully', {
            tasks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllAssignedTasks = getAllAssignedTasks;
const createTaskObservation = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { note } = req.body;
        const userId = req.user.id;
        const files = req.files;
        // Verify task exists and belongs to user
        const task = await prisma_1.default.task.findFirst({
            where: {
                id: taskId,
                assignedToId: userId
            }
        });
        if (!task) {
            // Clean up uploaded files if task not found
            if (files) {
                await Promise.all(files.map(file => (0, upload_1.deleteFile)(file.filename)));
            }
            throw new NotFoundError_1.NotFoundError('Task not found or you are not assigned to it');
        }
        // Process file URLs
        const mediaUrls = files?.map(file => (0, upload_1.getFileUrl)(file.filename)) || [];
        // Create the observation
        const observation = await prisma_1.default.taskObservation.create({
            data: {
                note,
                mediaUrls,
                taskId,
                reportedById: userId,
                reportedAt: new Date()
            },
            include: {
                reportedBy: { select: selects_1.userSelect }
            }
        });
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Task observation reported successfully', { observation }, 201);
    }
    catch (error) {
        // Clean up files if error occurs
        if (req.files) {
            await Promise.all(req.files.map(file => (0, upload_1.deleteFile)(file.filename)));
        }
        next(error);
    }
};
exports.createTaskObservation = createTaskObservation;
