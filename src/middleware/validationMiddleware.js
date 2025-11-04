import { validationResult } from 'express-validator';

// Middleware para processar resultados de validação
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({
            campo: err.path,
            mensagem: err.msg
        }));
        
        return res.status(400).json({
            error: "Erro de validação",
            detalhes: extractedErrors
        });
    }
    
    next();
};

export default validate;
