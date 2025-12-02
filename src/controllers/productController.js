import ProductModel from "../models/productModel.js";
import SupplierModel from "../models/supplierModel.js";

class ProductController {
    // Listar todos os produtos
    async index(req, res) {
        try {
            const products = await ProductModel.findAll();
            
            // Produtos já têm o campo stock direto do banco
            const productsWithStock = products.map(product => ({
                ...product,
                estoqueAtual: product.stock
            }));

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
            const product = await ProductModel.findById(Number(id));

            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            // Produto já tem o campo stock direto
            res.json({
                ...product,
                estoqueAtual: product.stock
            });
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            res.status(500).json({ error: "Erro ao buscar produto" });
        }
    }

    // Obter um produto pelo código de barras
    async showByBarcode(req, res) {
        try {
            const { barcode } = req.params;
            const product = await ProductModel.findByBarcode(barcode);

            if (!product) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            // Produto já tem o campo stock direto
            res.json({
                ...product,
                estoqueAtual: product.stock
            });
        } catch (error) {
            console.error("Erro ao buscar produto por barcode:", error);
            res.status(500).json({ error: "Erro ao buscar produto" });
        }
    }

    // Criar um novo produto (somente admin)
    async store(req, res) {
        try {
            const { barcode, name, description, price, stock, category, estoqueMinimo, fornecedorId } = req.body;

            // Validação básica
            if (!barcode || !name || price === undefined || category === undefined || !fornecedorId) {
                return res.status(400).json({ 
                    error: "Os campos barcode, name, price, category e fornecedorId são obrigatórios" 
                });
            }

            // Verificar se o barcode já existe
            const productExists = await ProductModel.findByBarcode(barcode);
            if (productExists) {
                return res.status(400).json({ error: "Este código de barras já está cadastrado!" });
            }

            // Verificar se o fornecedor existe
            const supplierExists = await SupplierModel.findById(Number(fornecedorId));
            if (!supplierExists) {
                return res.status(404).json({ error: "Fornecedor não encontrado" });
            }

            // Criar o produto
            const data = { 
                barcode,
                name,
                description,
                price: Number(price),
                stock: stock !== undefined ? Number(stock) : 0,
                category,
                estoqueMinimo: estoqueMinimo !== undefined ? Number(estoqueMinimo) : 10,
                fornecedorId: Number(fornecedorId)
            };
            const product = await ProductModel.create(data);

            return res.status(201).json(product);
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            res.status(500).json({ error: "Erro ao criar produto" });
        }
    }

        // Atualizar um produto (somente admin)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { barcode, name, description, price, stock, category, estoqueMinimo, fornecedorId } = req.body;

            // Verificar se o produto existe
            const productExists = await ProductModel.findById(Number(id));
            if (!productExists) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            // Se o barcode foi alterado, verificar se já não existe
            if (barcode && barcode !== productExists.barcode) {
                const barcodeExists = await ProductModel.findByBarcode(barcode);
                if (barcodeExists) {
                    return res.status(400).json({ error: "Este código de barras já está cadastrado!" });
                }
            }

            // Se o fornecedor foi alterado, verificar se existe
            if (fornecedorId) {
                const supplierExists = await SupplierModel.findById(Number(fornecedorId));
                if (!supplierExists) {
                    return res.status(404).json({ error: "Fornecedor não encontrado" });
                }
            }

            // Atualizar o produto
            const data = {};
            if (barcode) data.barcode = barcode;
            if (name) data.name = name;
            if (description !== undefined) data.description = description;
            if (price !== undefined) data.price = Number(price);
            if (stock !== undefined) data.stock = Number(stock);
            if (category) data.category = category;
            if (estoqueMinimo !== undefined) data.estoqueMinimo = Number(estoqueMinimo);
            if (fornecedorId) data.fornecedorId = Number(fornecedorId);

            const product = await ProductModel.update(Number(id), data);

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
            const productExists = await ProductModel.findById(Number(id));
            if (!productExists) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            await ProductModel.delete(Number(id));

            return res.json({ message: "Produto excluído com sucesso!" });
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            res.status(500).json({ error: "Erro ao excluir produto" });
        }
    }
}

export default new ProductController();
