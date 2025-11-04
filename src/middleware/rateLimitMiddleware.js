import rateLimit from 'express-rate-limit';

// Desabilita rate limiting em ambiente de teste
const isTestEnvironment = process.env.NODE_ENV === 'test';

// Rate limiter para autenticação (mais restritivo)
export const authLimiter = isTestEnvironment 
    ? (req, res, next) => next() // Bypass em testes
    : rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 5, // 5 tentativas
        message: {
            error: 'Muitas tentativas de login',
            mensagem: 'Por favor, aguarde 15 minutos antes de tentar novamente',
            tentativasRestantes: 0
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                error: 'Muitas tentativas de autenticação',
                mensagem: 'Você excedeu o limite de tentativas. Aguarde 15 minutos.',
                retryAfter: '15 minutos'
            });
        }
    });

// Rate limiter geral para a API
export const apiLimiter = isTestEnvironment
    ? (req, res, next) => next() // Bypass em testes
    : rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // 100 requisições por IP
        message: {
            error: 'Muitas requisições',
            mensagem: 'Você excedeu o limite de requisições. Tente novamente em 15 minutos.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                error: 'Limite de requisições excedido',
                mensagem: 'Você fez muitas requisições. Por favor, aguarde antes de tentar novamente.',
                retryAfter: '15 minutos'
            });
        }
    });

// Rate limiter para criação de recursos (POST)
export const createLimiter = isTestEnvironment
    ? (req, res, next) => next() // Bypass em testes
    : rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hora
        max: 50, // 50 criações por hora
        message: {
            error: 'Limite de criações excedido',
            mensagem: 'Você excedeu o limite de criação de recursos por hora.'
        },
        standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false
});

export default { authLimiter, apiLimiter, createLimiter };
