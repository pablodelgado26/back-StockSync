import { body } from 'express-validator';

export const supplierValidation = {
    create: [
        body('nome')
            .trim()
            .notEmpty().withMessage('Nome é obrigatório')
            .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
        
        body('contato')
            .trim()
            .notEmpty().withMessage('Contato é obrigatório')
            .matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/).withMessage('Formato de telefone inválido. Use (XX) XXXXX-XXXX'),
        
        body('cnpj')
            .trim()
            .notEmpty().withMessage('CNPJ é obrigatório')
            .matches(/^\d{8}\/\d{4}-\d{2}$/).withMessage('Formato de CNPJ inválido. Use XXXXXXXX/XXXX-XX')
    ],
    
    update: [
        body('nome')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
        
        body('contato')
            .optional()
            .trim()
            .matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/).withMessage('Formato de telefone inválido'),
        
        body('cnpj')
            .optional()
            .trim()
            .matches(/^\d{8}\/\d{4}-\d{2}$/).withMessage('Formato de CNPJ inválido')
    ]
};

export const productValidation = {
    create: [
        body('sku')
            .trim()
            .notEmpty().withMessage('SKU é obrigatório')
            .isLength({ min: 3, max: 50 }).withMessage('SKU deve ter entre 3 e 50 caracteres')
            .matches(/^[A-Z0-9-]+$/).withMessage('SKU deve conter apenas letras maiúsculas, números e hífens'),
        
        body('nome')
            .trim()
            .notEmpty().withMessage('Nome é obrigatório')
            .isLength({ min: 3, max: 200 }).withMessage('Nome deve ter entre 3 e 200 caracteres'),
        
        body('estoqueMinimo')
            .notEmpty().withMessage('Estoque mínimo é obrigatório')
            .isInt({ min: 0 }).withMessage('Estoque mínimo deve ser um número inteiro não negativo'),
        
        body('fornecedorId')
            .notEmpty().withMessage('Fornecedor é obrigatório')
            .isInt({ min: 1 }).withMessage('ID do fornecedor inválido')
    ],
    
    update: [
        body('sku')
            .optional()
            .trim()
            .isLength({ min: 3, max: 50 }).withMessage('SKU deve ter entre 3 e 50 caracteres')
            .matches(/^[A-Z0-9-]+$/).withMessage('SKU deve conter apenas letras maiúsculas, números e hífens'),
        
        body('nome')
            .optional()
            .trim()
            .isLength({ min: 3, max: 200 }).withMessage('Nome deve ter entre 3 e 200 caracteres'),
        
        body('estoqueMinimo')
            .optional()
            .isInt({ min: 0 }).withMessage('Estoque mínimo deve ser um número inteiro não negativo'),
        
        body('fornecedorId')
            .optional()
            .isInt({ min: 1 }).withMessage('ID do fornecedor inválido')
    ]
};

export const stockMovementValidation = {
    create: [
        body('tipo')
            .notEmpty().withMessage('Tipo é obrigatório')
            .isIn(['entrada', 'saida']).withMessage('Tipo deve ser "entrada" ou "saida"'),
        
        body('quantidade')
            .notEmpty().withMessage('Quantidade é obrigatória')
            .isInt({ min: 1 }).withMessage('Quantidade deve ser um número inteiro maior que zero'),
        
        body('produtoId')
            .notEmpty().withMessage('Produto é obrigatório')
            .isInt({ min: 1 }).withMessage('ID do produto inválido'),
        
        body('data')
            .optional()
            .isISO8601().withMessage('Data deve estar no formato ISO 8601')
    ]
};

export const authValidation = {
    register: [
        body('name')
            .trim()
            .notEmpty().withMessage('Nome é obrigatório')
            .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
        
        body('email')
            .trim()
            .notEmpty().withMessage('Email é obrigatório')
            .isEmail().withMessage('Email inválido')
            .normalizeEmail(),
        
        body('password')
            .notEmpty().withMessage('Senha é obrigatória')
            .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
        
        body('role')
            .optional()
            .isIn(['admin', 'estoquista']).withMessage('Role deve ser "admin" ou "estoquista"')
    ],
    
    login: [
        body('email')
            .trim()
            .notEmpty().withMessage('Email é obrigatório')
            .isEmail().withMessage('Email inválido')
            .normalizeEmail(),
        
        body('password')
            .notEmpty().withMessage('Senha é obrigatória')
    ]
};
