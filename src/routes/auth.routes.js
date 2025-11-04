import express from 'express';
import AuthController from '../controllers/authController.js';
import { authValidation } from '../validators/index.js';
import validate from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const authRouter = express.Router();

// GET - Listar usuários (sem rate limit específico)
authRouter.get("/users", AuthController.getAllUsers);

// POST - Registrar (com rate limit e validação)
authRouter.post(
    "/register", 
    authLimiter,
    authValidation.register,
    validate,
    AuthController.register
);

// POST - Login (com rate limit e validação)
authRouter.post(
    "/login",
    authLimiter,
    authValidation.login,
    validate,
    AuthController.login
);

export default authRouter;