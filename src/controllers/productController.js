import ProductModel from "../models/productModel.js";
import SupplierModel from "../models/supplierModel.js";

class ProductController {
    // Listar todos os produtos
    async index(req, res) {
        try {
            const products = await ProductModel.findAll();
            
            // Adicionar estoque atual para cada produto
            const productsWithStock = await Promise.all(
                products.map(async (product) => {
                    const estoqueAtual = await ProductModel.getStockQuantity(product.id);
                    return {
                        ...product,
                        estoqueAtual
                    };
                })
            );

            res.json(productsWithStock);
        } catch (error) {
            console.error("Erro ao listar produtos:", error);
            res.status(500).json({ error: "Erro ao listar produtos" });
        }
    }

    // Obter um produto pelo ID
    async show(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductModel.findById(id);

            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            // Adicionar estoque atual
            const estoqueAtual = await ProductModel.getStockQuantity(id);
            
            res.json({
                ...product,
                estoqueAtual
            });
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            res.status(500).json({ error: "Erro ao buscar produto" });
        }
    }

    // Criar um novo produto (somente admin)
    async store(req, res) {
        try {
            const { sku, nome, estoqueMinimo, fornecedorId } = req.body;

            // Validação básica
            if (!sku || !nome || estoqueMinimo === undefined || !fornecedorId) {
                return res.status(400).json({ 
                    error: "Os campos SKU, nome, estoque mínimo e fornecedor são obrigatórios" 
                });
            }

            // Verificar se o SKU já existe
            const productExists = await ProductModel.findBySku(sku);
            if (productExists) {
                return res.status(400).json({ error: "Este SKU já está cadastrado!" });
            }

            // Verificar se o fornecedor existe
            const supplierExists = await SupplierModel.findById(fornecedorId);
            if (!supplierExists) {
                return res.status(404).json({ error: "Fornecedor não encontrado" });
            }

            // Criar o produto
            const data = { 
                sku, 
                nome, 
                estoqueMinimo: Number(estoqueMinimo),
                fornecedorId: Number(fornecedorId)
            };
            const product = await ProductModel.create(data);

            return res.status(201).json({
                message: "Produto criado com sucesso!",
                product,
            });
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            res.status(500).json({ error: "Erro ao criar produto" });
        }
    }

    // Atualizar um produto (somente admin)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { sku, nome, estoqueMinimo, fornecedorId } = req.body;

            // Verificar se o produto existe
            const productExists = await ProductModel.findById(id);
            if (!productExists) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            // Se o SKU foi alterado, verificar se já não existe
            if (sku && sku !== productExists.sku) {
                const skuExists = await ProductModel.findBySku(sku);
                if (skuExists) {
                    return res.status(400).json({ error: "Este SKU já está cadastrado!" });
                }
            }

            // Se o fornecedor foi alterado, verificar se existe
            if (fornecedorId) {
                const supplierExists = await SupplierModel.findById(fornecedorId);
                if (!supplierExists) {
                    return res.status(404).json({ error: "Fornecedor não encontrado" });
                }
            }

            // Atualizar o produto
            const data = {};
            if (sku) data.sku = sku;
            if (nome) data.nome = nome;
            if (estoqueMinimo !== undefined) data.estoqueMinimo = Number(estoqueMinimo);
            if (fornecedorId) data.fornecedorId = Number(fornecedorId);

            const product = await ProductModel.update(id, data);

            return res.json({
                message: "Produto atualizado com sucesso!",
                product,
            });
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            res.status(500).json({ error: "Erro ao atualizar produto" });
        }
    }

    // Excluir um produto (somente admin)
    async destroy(req, res) {
        try {
            const { id } = req.params;

            // Verificar se o produto existe
            const productExists = await ProductModel.findById(id);
            if (!productExists) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            await ProductModel.delete(id);

            return res.json({ message: "Produto excluído com sucesso!" });
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            res.status(500).json({ error: "Erro ao excluir produto" });
        }
    }
}

export default new ProductController();
