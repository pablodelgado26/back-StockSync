// Middleware de tratamento de erros global
export const errorHandler = (err, req, res, next) => {
    // Log do erro (em produção, usar um logger apropriado)
    console.error('Erro capturado:', {
        mensagem: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.originalUrl,
        metodo: req.method,
        timestamp: new Date().toISOString()
    });

    // Erro de validação do Prisma
    if (err.name === 'PrismaClientValidationError') {
        return res.status(400).json({
            error: 'Erro de validação dos dados',
            mensagem: 'Os dados fornecidos são inválidos'
        });
    }

    // Erro de registro não encontrado
    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Recurso não encontrado',
            mensagem: 'O registro solicitado não existe'
        });
    }

    // Erro de constraint única (ex: email/SKU/CNPJ duplicado)
    if (err.code === 'P2002') {
        const campo = err.meta?.target?.[0] || 'campo';
        return res.status(409).json({
            error: 'Conflito de dados',
            mensagem: `${campo} já está em uso`
        });
    }

    // Erro de chave estrangeira
    if (err.code === 'P2003') {
        return res.status(400).json({
            error: 'Referência inválida',
            mensagem: 'O recurso referenciado não existe'
        });
    }

    // Erro de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido',
            mensagem: 'Token de autenticação inválido'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expirado',
            mensagem: 'Token de autenticação expirado'
        });
    }

    // Erro padrão
    const statusCode = err.statusCode || 500;
    const mensagem = err.message || 'Erro interno do servidor';

    res.status(statusCode).json({
        error: process.env.NODE_ENV === 'production' ? 'Erro no servidor' : mensagem,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Middleware para rotas não encontradas
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não existe`,
        sugestao: 'Verifique a documentação da API'
    });
};

export default errorHandler;
