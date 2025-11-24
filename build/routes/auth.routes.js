"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = require("../middlewares/validateRequest");
const auth_schemas_1 = require("../schemas/auth.schemas");
const errorHandler_1 = require("../middlewares/errorHandler");
const roleCheck_1 = require("../middlewares/roleCheck");
const users_schemas_1 = require("../schemas/users.schemas");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/admin-reg', (0, validateRequest_1.validateRequest)(auth_schemas_1.adminRegisterSchema), auth_controller_1.adminRegister);
exports.authRouter.post('/register', errorHandler_1.authenticateJWT, (0, roleCheck_1.requireRoles)(['ADMIN', 'FARM_KEEPER']), (0, validateRequest_1.validateRequest)(auth_schemas_1.registerSchema), auth_controller_1.register);
exports.authRouter.post('/login', (0, validateRequest_1.validateRequest)(auth_schemas_1.loginSchema), auth_controller_1.login);
exports.authRouter.post('/vet-reg', (0, validateRequest_1.validateRequest)(auth_schemas_1.vetRegisterSchema), auth_controller_1.vetRegister);
exports.authRouter.post('/vet-login', (0, validateRequest_1.validateRequest)(auth_schemas_1.loginSchema), auth_controller_1.vetLogin);
exports.authRouter.post('/resend', (0, validateRequest_1.validateRequest)(auth_schemas_1.requestVerificationSchema), auth_controller_1.requestVerificationCode);
exports.authRouter.put('/verify', (0, validateRequest_1.validateRequest)(auth_schemas_1.verifyAccountSchema), auth_controller_1.verifyAccount);
exports.authRouter.put('/reset', (0, validateRequest_1.validateRequest)(auth_schemas_1.resetPasswordSchema), auth_controller_1.resetPassword);
// Google Strategy
// authRouter.get(
// 	'/google',
// 	passport.authenticate('google', { scope: ['profile', 'email'] })
// );
// authRouter.get(
// 	'/google/callback',
// 	passport.authenticate('google', { session: false }),
// 	(req, res) => {
// 		const { user, token } = req.user as any;
// 		res.json({
// 			message: 'Login successful',
// 			user,
// 			token,
// 		});
// 		sendSuccessResponse(res, 'Login successful', { user, token });
// 	}
// );
exports.authRouter.get('/failure', (_req, res) => {
    res.status(401).json({ error: 'Failed to authenticate' });
});
exports.authRouter.post('/forgot-password', (0, validateRequest_1.validateRequest)(auth_schemas_1.forgotPasswordSchema), auth_controller_1.forgotPassword);
exports.authRouter.patch('/change-password', errorHandler_1.authenticateJWT, (0, validateRequest_1.validateRequest)(users_schemas_1.changePasswordSchema), auth_controller_1.changePassword);
