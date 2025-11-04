import express from "express"

// Importar todas as rotas
import authRouter from "./auth.routes.js"
import supplierRouter from "./supplier.routes.js"
import productRouter from "./product.routes.js"
import stockMovementRouter from "./stockMovement.routes.js"
import dashboardRouter from "./dashboard.routes.js"

import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

//Rotas públicas
router.use("/auth", authRouter);

//Rotas protegidas (requerem autenticação)
router.use(authMiddleware)

// Rotas do sistema de estoque
router.use("/suppliers", supplierRouter);
router.use("/products", productRouter);
router.use("/stockmovements", stockMovementRouter);
router.use("/dashboard", dashboardRouter);


export default router