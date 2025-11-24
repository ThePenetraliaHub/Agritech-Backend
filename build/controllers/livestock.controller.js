"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreLivestock = exports.getDeletedLivestock = exports.softDeleteLivestock = exports.deleteLivestock = exports.updateLivestock = exports.getLivestockCounts = exports.getAllLivestock = exports.getLivestock = exports.addLivestock = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const sendSuccessResponse_1 = require("../utils/sendSuccessResponse");
const NotFoundError_1 = require("../errors/NotFoundError");
const selects_1 = require("../prisma/selects");
const BadRequestError_1 = require("../errors/BadRequestError");
const addLivestock = async (req, res, next) => {
    try {
        const { tagId, type, breed, birthDate, healthStatus, weight, gender, livestockSource, livestockPurpose } = req.body;
        const addedById = req.user.id;
        const livestock = await prisma_1.default.livestock.create({
            data: {
                tagId,
                type,
                breed,
                birthDate: birthDate ? new Date(birthDate) : null,
                healthStatus,
                weight: weight ? parseFloat(weight) : null,
                gender,
                livestockSource,
                livestockPurpose,
                addedById,
            },
            include: {
                addedBy: { select: selects_1.userSelect }, // Include the user who added the livestock
            },
        });
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Livestock successfully added', { livestock }, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.addLivestock = addLivestock;
const getLivestock = async (req, res, next) => {
    try {
        const livestock = await prisma_1.default.livestock.findUnique({
            where: {
                id: req.params.livestockId,
            },
            include: {
                addedBy: { select: selects_1.userSelect },
                updatedBy: { select: selects_1.userSelect }
            },
        });
        if (!livestock)
            throw new NotFoundError_1.NotFoundError('Livestock not found');
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Livestock retrieved successfully', { livestock });
    }
    catch (error) {
        next(error);
    }
};
exports.getLivestock = getLivestock;
const getAllLivestock = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, type } = req.query;
        const where = {
            isDeleted: false,
            ...(type && { type: String(type) })
        };
        const livestock = await prisma_1.default.livestock.findMany({
            where,
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            include: {
                addedBy: { select: selects_1.userSelect },
                vaccinationRecords: {
                    orderBy: { dateofVaccination: 'desc' },
                    select: {
                        id: true,
                        dateofVaccination: true,
                        vaccineType: true,
                        dosage: true,
                        administeredBy: true,
                        nextDueDate: true
                    }
                },
                treatments: {
                    orderBy: { dateOfTreatment: 'desc' },
                    select: {
                        id: true,
                        dateOfTreatment: true,
                        nextDueDate: true,
                        treatmentType: true,
                        dosage: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        const total = await prisma_1.default.livestock.count({ where });
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Livestock retrieved successfully', {
            livestock,
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
exports.getAllLivestock = getAllLivestock;
const getLivestockCounts = async (req, res, next) => {
    try {
        const [totalLivestock, sickLivestock] = await Promise.all([
            prisma_1.default.livestock.count({
                where: {
                    isDeleted: false
                }
            }),
            prisma_1.default.livestock.count({
                where: {
                    isDeleted: false,
                    healthStatus: {
                        in: ['SICK', 'IN_TREATMENT', 'CRITICAL']
                    },
                    sickness: {
                        some: {}
                    }
                }
            })
        ]);
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Livestock counts retrieved', {
            totalLivestock,
            sickLivestock
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLivestockCounts = getLivestockCounts;
const updateLivestock = async (req, res, next) => {
    try {
        const livestockId = req.params.livestockId;
        const updateData = req.body;
        const updatedById = req.user.id;
        const existingLivestock = await prisma_1.default.livestock.findUnique({
            where: { id: livestockId }
        });
        if (!existingLivestock) {
            throw new NotFoundError_1.NotFoundError('Livestock not found');
        }
        const livestock = await prisma_1.default.livestock.update({
            where: { id: livestockId },
            data: {
                ...updateData,
                updatedById,
                updatedAt: new Date() // Explicit timestamp update
            },
            include: {
                addedBy: { select: selects_1.userSelect },
                updatedBy: { select: selects_1.userSelect }
            }
        });
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Livestock updated successfully', { livestock });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLivestock = updateLivestock;
// permenant delete livestock
// This will remove the livestock record from the database
const deleteLivestock = async (req, res, next) => {
    try {
        const livestock = await prisma_1.default.livestock.findUnique({
            where: { id: req.params.livestockId },
        });
        if (!livestock)
            throw new NotFoundError_1.NotFoundError('Livestock not found');
        await prisma_1.default.livestock.delete({
            where: { id: req.params.livestockId, },
        });
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Livestock deleted successfully!', { livestock });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLivestock = deleteLivestock;
// This will mark the livestock as deleted without removing it from the database
const softDeleteLivestock = async (req, res, next) => {
    try {
        const { livestockId } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        // Verify livestock exists
        const livestock = await prisma_1.default.livestock.findUnique({
            where: { id: livestockId, isDeleted: false }
        });
        if (!livestock) {
            throw new NotFoundError_1.NotFoundError('Livestock not found');
        }
        if (userRole === 'FARM_KEEPER' && !reason) {
            throw new BadRequestError_1.BadRequestError('Deletion reason is required for farm keepers');
        }
        // Determine the deletion reason
        const finalReason = reason || (userRole === 'ADMIN' ? 'Admin deletion' : null);
        // Soft delete
        const deletedLivestock = await prisma_1.default.livestock.update({
            where: { id: livestockId },
            data: {
                isDeleted: true,
                deletionReason: finalReason,
                deletedAt: new Date(),
                deletedById: userId
            },
            include: {
                addedBy: { select: selects_1.userSelect },
                deletedBy: { select: selects_1.userSelect }
            }
        });
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Livestock deleted successfully', { livestock: deletedLivestock });
    }
    catch (error) {
        next(error);
    }
};
exports.softDeleteLivestock = softDeleteLivestock;
// Get deleted livestock (Admin only)
const getDeletedLivestock = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const [deletedLivestock, total] = await Promise.all([
            prisma_1.default.livestock.findMany({
                where: { isDeleted: true },
                include: {
                    addedBy: { select: selects_1.userSelect },
                    deletedBy: { select: selects_1.userSelect }
                },
                orderBy: { deletedAt: 'desc' },
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit)
            }),
            prisma_1.default.livestock.count({ where: { isDeleted: true } })
        ]);
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Deleted livestock retrieved', {
            deletedLivestock,
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
exports.getDeletedLivestock = getDeletedLivestock;
// Restore livestock (Admin only)
const restoreLivestock = async (req, res, next) => {
    try {
        const { livestockId } = req.params;
        const livestock = await prisma_1.default.livestock.update({
            where: { id: livestockId, isDeleted: true },
            data: {
                isDeleted: false,
                deletionReason: null,
                deletedAt: null,
                deletedById: null
            }
        });
        if (!livestock) {
            throw new NotFoundError_1.NotFoundError('Deleted livestock not found');
        }
        (0, sendSuccessResponse_1.sendSuccessResponse)(res, 'Livestock restored successfully', { livestock });
    }
    catch (error) {
        next(error);
    }
};
exports.restoreLivestock = restoreLivestock;
