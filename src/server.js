import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import router from "./routes/index.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";

// Carrega variáveis de ambiente
config();

const port = process.env.PORT || 4000;
const isDevelopment = process.env.NODE_ENV === 'development';

// Inicializa o Express
const app = express();

// Middlewares de segurança
app.use(helmet()); // Proteção de headers HTTP
app.use(cors()); // Habilita CORS
app.use(compression()); // Compressão de respostas

// Rate limiting
app.use(apiLimiter);

// Logging
if (isDevelopment) {
    app.use(morgan('dev')); // Logs detalhados em desenvolvimento
} else {
    app.use(morgan('combined')); // Logs padrão em produção
}

// Parse de JSON e URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Rotas da aplicação
app.use("/", router);

// Middleware para rotas não encontradas (404)
app.use(notFoundHandler);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Iniciar o servidor
app.listen(port, () => {
    console.log('🚀 Servidor StockSync iniciado!');
    console.log(`📡 Porta: ${port}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
    console.log('-------------------------------------------');
});
