import request from 'supertest';
import express from 'express';
import cors from 'cors';
import router from '../src/routes/index.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

describe('Testes de Fornecedores (Suppliers)', () => {
  let adminToken;
  let estoquistaToken;
  let createdSupplierId;

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
  });

  describe('GET /suppliers', () => {
    test('Admin deve listar todos os fornecedores', async () => {
      const response = await request(app)
        .get('/suppliers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('nome');
      expect(response.body[0]).toHaveProperty('cnpj');
    });

    test('Estoquista deve listar fornecedores', async () => {
      const response = await request(app)
        .get('/suppliers')
        .set('Authorization', `Bearer ${estoquistaToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('Deve falhar sem autenticação', async () => {
      const response = await request(app)
        .get('/suppliers');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /suppliers', () => {
    test('Admin deve criar fornecedor com sucesso', async () => {
      const response = await request(app)
        .post('/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Fornecedor Teste LTDA',
          contato: '(11) 98765-4321',
          cnpj: `${Date.now().toString().slice(-8)}/0001-00`
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('Fornecedor Teste LTDA');
      
      createdSupplierId = response.body.id;
    });

    test('Estoquista NÃO deve criar fornecedor', async () => {
      const response = await request(app)
        .post('/suppliers')
        .set('Authorization', `Bearer ${estoquistaToken}`)
        .send({
          nome: 'Fornecedor Não Permitido',
          contato: '(11) 99999-9999',
          cnpj: '11111111/0001-11'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve falhar com campos faltando', async () => {
      const response = await request(app)
        .post('/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Incompleto'
          // Faltando contato e cnpj
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /suppliers/:id', () => {
    test('Deve buscar fornecedor por ID', async () => {
      // Pegar o primeiro fornecedor da lista
      const listResponse = await request(app)
        .get('/suppliers')
        .set('Authorization', `Bearer ${adminToken}`);
      
      const firstSupplierId = listResponse.body[0]?.id;
      
      if (!firstSupplierId) {
        console.warn('Nenhum fornecedor encontrado para testar');
        return;
      }

      const response = await request(app)
        .get(`/suppliers/${firstSupplierId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', firstSupplierId);
      expect(response.body).toHaveProperty('nome');
    });

    test('Deve retornar 404 para ID inexistente', async () => {
      const response = await request(app)
        .get('/suppliers/999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /suppliers/:id', () => {
    test('Admin deve atualizar fornecedor', async () => {
      const response = await request(app)
        .put(`/suppliers/${createdSupplierId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'Fornecedor Teste Atualizado',
          contato: '(11) 91234-5678',
          cnpj: `${Date.now().toString().slice(-8)}/0001-00`
        });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Fornecedor Teste Atualizado');
    });

    test('Estoquista NÃO deve atualizar fornecedor', async () => {
      const response = await request(app)
        .put('/suppliers/1')
        .set('Authorization', `Bearer ${estoquistaToken}`)
        .send({
          nome: 'Tentativa de Atualização'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /suppliers/:id', () => {
    test('Estoquista NÃO deve excluir fornecedor', async () => {
      const response = await request(app)
        .delete(`/suppliers/${createdSupplierId}`)
        .set('Authorization', `Bearer ${estoquistaToken}`);

      expect(response.status).toBe(403);
    });

    test('Admin deve excluir fornecedor', async () => {
      const response = await request(app)
        .delete(`/suppliers/${createdSupplierId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    test('Deve retornar 404 ao excluir ID inexistente', async () => {
      const response = await request(app)
        .delete('/suppliers/999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
