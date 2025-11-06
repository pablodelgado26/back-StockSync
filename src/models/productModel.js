import prisma from '../../prisma/prisma.js';

class ProductModel {
    // Obter todos os produtos
    async findAll() {
        const products = await prisma.product.findMany({
            include: {
                fornecedor: true,
                stockMovements: true
            }
        });

        return products;
    }

    // Obter um produto pelo ID
    async findById(id) {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                fornecedor: true,
                stockMovements: true
            }
        });

        return product;
    }

    // Obter um produto pelo barcode
    async findByBarcode(barcode) {
        const product = await prisma.product.findUnique({
            where: {
                barcode,
            },
            include: {
                fornecedor: true,
                stockMovements: true
            }
        });

        return product;
    }

    // Criar um novo produto
    async create(data) {
        const product = await prisma.product.create({
            data,
            include: {
                fornecedor: true
            }
        });

        return product;
    }

    // Atualizar um produto
    async update(id, data) {
        const product = await prisma.product.update({
            where: {
                id: Number(id)
            },
            data,
            include: {
                fornecedor: true
            }
        });

        return product;
    }

    // Excluir um produto
    async delete(id) {
        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        });

        return true;
    }

    // Calcular estoque atual de um produto (mantido para compatibilidade com movimentações)
    async getStockQuantity(productId) {
        // Retorna o estoque direto do produto
        const product = await prisma.product.findUnique({
            where: { id: Number(productId) },
            select: { stock: true }
        });
        
        return product ? product.stock : 0;
    }

    // Atualizar estoque após movimentação
    async updateStock(productId, quantidade, tipo) {
        const product = await prisma.product.findUnique({
            where: { id: Number(productId) }
        });

        if (!product) return null;

        const novoEstoque = tipo === 'entrada' 
            ? product.stock + quantidade 
            : product.stock - quantidade;

        return await prisma.product.update({
            where: { id: Number(productId) },
            data: { stock: novoEstoque }
        });
    }

    // Obter produtos com estoque baixo
    async getLowStockProducts() {
        const products = await this.findAll();
        const lowStockProducts = [];

        for (const product of products) {
            if (product.stock < product.estoqueMinimo) {
                lowStockProducts.push({
                    ...product,
                    estoqueAtual: product.stock
                });
            }
        }

        return lowStockProducts;
    }
}

export default new ProductModel();
