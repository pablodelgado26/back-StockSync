import request from 'supertest';
import express from 'express';
import cors from 'cors';
import router from '../src/routes/index.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

describe('Testes de Produtos (Products)', () => {
  let adminToken;
  let estoquistaToken;
  let createdProductId;
  let supplierId;

  beforeAll(async () => {
    // Login como admin
    const adminResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@stocksync.com',
        password: '123456'
      });
    adminToken = adminResponse.body.token;

    // Login como estoquista
    const estoquistaResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'maria.estoquista@stocksync.com',
        password: '123456'
      });
    estoquistaToken = estoquistaResponse.body.token;

    // Buscar um fornecedor existente
    const suppliers = await request(app)
      .get('/suppliers')
      .set('Authorization', `Bearer ${adminToken}`);
    supplierId = suppliers.body[0].id;
  });

  describe('GET /products', () => {
    test('Admin deve listar todos os produtos', async () => {
      const response = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('nome');
      expect(response.body[0]).toHaveProperty('sku');
      expect(response.body[0]).toHaveProperty('estoqueMinimo');
    });

    test('Estoquista deve listar produtos', async () => {
      const response = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${estoquistaToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('Deve falhar sem autenticação', async () => {
      const response = await request(app)
        .get('/products');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /products', () => {
    test('Admin deve criar produto com sucesso', async () => {
      const uniqueSku = `TEST-${Date.now()}`;
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sku: uniqueSku,
          nome: 'Produto Teste',
          estoqueMinimo: 10,
          fornecedorId: supplierId
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.sku).toBe(uniqueSku);
      expect(response.body.nome).toBe('Produto Teste');
      
      createdProductId = response.body.id;
    });

    test('Estoquista NÃO deve criar produto', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${estoquistaToken}`)
        .send({
          sku: `FORBIDDEN-${Date.now()}`,
          nome: 'Produto Não Permitido',
          estoqueMinimo: 5,
          fornecedorId: supplierId
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve falhar com SKU duplicado', async () => {
      const duplicateSku = `DUP-${Date.now()}`;
      
      // Criar primeiro produto
      await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sku: duplicateSku,
          nome: 'Primeiro',
          estoqueMinimo: 10,
          fornecedorId: supplierId
        });

      // Tentar criar com mesmo SKU
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sku: duplicateSku,
          nome: 'Segundo',
          estoqueMinimo: 10,
          fornecedorId: supplierId
        });

      expect(response.status).toBe(400);
    });

    test('Deve falhar com campos faltando', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Incompleto'
          // Faltando sku, estoqueMinimo e fornecedorId
        });

      expect(response.status).toBe(400);
    });

    test('Deve falhar com fornecedor inexistente', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sku: `INVALID-${Date.now()}`,
          nome: 'Fornecedor Inválido',
          estoqueMinimo: 10,
          fornecedorId: 999999
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /products/:id', () => {
    test('Deve buscar produto por ID com fornecedor', async () => {
      // Pegar o primeiro produto da lista
      const listResponse = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${adminToken}`);
      
      const firstProductId = listResponse.body[0]?.id;
      
      if (!firstProductId) {
        console.warn('Nenhum produto encontrado para testar');
        return;
      }

      const response = await request(app)
        .get(`/products/${firstProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', firstProductId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('fornecedor');
    });

    test('Deve retornar 404 para ID inexistente', async () => {
      const response = await request(app)
        .get('/products/999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /products/:id', () => {
    test('Admin deve atualizar produto', async () => {
      const response = await request(app)
        .put(`/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Produto Teste Atualizado',
          estoqueMinimo: 20
        });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Produto Teste Atualizado');
      expect(response.body.estoqueMinimo).toBe(20);
    });

    test('Estoquista NÃO deve atualizar produto', async () => {
      const response = await request(app)
        .put('/products/1')
        .set('Authorization', `Bearer ${estoquistaToken}`)
        .send({
          nome: 'Tentativa de Atualização'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /products/:id', () => {
    test('Estoquista NÃO deve excluir produto', async () => {
      const response = await request(app)
        .delete(`/products/${createdProductId}`)
        .set('Authorization', `Bearer ${estoquistaToken}`);

      expect(response.status).toBe(403);
    });

    test('Admin deve excluir produto', async () => {
      const response = await request(app)
        .delete(`/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    test('Deve retornar 404 ao excluir ID inexistente', async () => {
      const response = await request(app)
        .delete('/products/999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
