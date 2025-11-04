import request from 'supertest';
import express from 'express';
import cors from 'cors';
import router from '../src/routes/index.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

describe('Testes de Movimentações de Estoque (Stock Movements)', () => {
  let adminToken;
  let estoquistaToken;
  let productId;
  let createdMovementId;

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

    // Buscar um produto existente
    const products = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${adminToken}`);
    productId = products.body[0].id;
  });

  describe('GET /stockmovements', () => {
    test('Deve listar todas as movimentações', async () => {
      const response = await request(app)
        .get('/stockmovements')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('tipo');
      expect(response.body[0]).toHaveProperty('quantidade');
      expect(response.body[0]).toHaveProperty('data');
    });

    test('Estoquista deve listar movimentações', async () => {
      const response = await request(app)
        .get('/stockmovements')
        .set('Authorization', `Bearer ${estoquistaToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('Deve filtrar por tipo "entrada"', async () => {
      const response = await request(app)
        .get('/stockmovements?tipo=entrada')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        response.body.forEach(mov => {
          expect(mov.tipo).toBe('entrada');
        });
      }
    });

    test('Deve filtrar por tipo "saida"', async () => {
      const response = await request(app)
        .get('/stockmovements?tipo=saida')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      if (response.body.length > 0) {
        response.body.forEach(mov => {
          expect(mov.tipo).toBe('saida');
        });
      }
    });

    test('Deve filtrar por produtoId', async () => {
      const response = await request(app)
        .get(`/stockmovements?produtoId=${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      if (response.body.length > 0) {
        response.body.forEach(mov => {
          expect(mov.produtoId).toBe(productId);
        });
      }
    });

    test('Deve filtrar por data de início', async () => {
      const dataInicio = '2025-01-01';
      const response = await request(app)
        .get(`/stockmovements?dataInicio=${dataInicio}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('Deve filtrar por intervalo de datas', async () => {
      const dataInicio = '2025-01-01';
      const dataFim = '2025-12-31';
      const response = await request(app)
        .get(`/stockmovements?dataInicio=${dataInicio}&dataFim=${dataFim}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /stockmovements', () => {
    test('Admin deve registrar entrada com sucesso', async () => {
      const response = await request(app)
        .post('/stockmovements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          tipo: 'entrada',
          quantidade: 50,
          produtoId: productId
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.tipo).toBe('entrada');
      expect(response.body.quantidade).toBe(50);
      
      createdMovementId = response.body.id;
    });

    test('Estoquista deve registrar entrada', async () => {
      const response = await request(app)
        .post('/stockmovements')
        .set('Authorization', `Bearer ${estoquistaToken}`)
        .send({
          tipo: 'entrada',
          quantidade: 25,
          produtoId: productId
        });

      expect(response.status).toBe(201);
      expect(response.body.tipo).toBe('entrada');
    });

    test('Deve registrar saída com sucesso', async () => {
      const response = await request(app)
        .post('/stockmovements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          tipo: 'saida',
          quantidade: 10,
          produtoId: productId
        });

      expect(response.status).toBe(201);
      expect(response.body.tipo).toBe('saida');
    });

    test('Deve falhar com tipo inválido', async () => {
      const response = await request(app)
        .post('/stockmovements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          tipo: 'transferencia',
          quantidade: 10,
          produtoId: productId
        });

      expect(response.status).toBe(400);
    });

    test('Deve falhar com quantidade negativa', async () => {
      const response = await request(app)
        .post('/stockmovements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          tipo: 'entrada',
          quantidade: -10,
          produtoId: productId
        });

      expect(response.status).toBe(400);
    });

    test('Deve falhar com quantidade zero', async () => {
      const response = await request(app)
        .post('/stockmovements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          tipo: 'entrada',
          quantidade: 0,
          produtoId: productId
        });

      expect(response.status).toBe(400);
    });

    test('Deve falhar com produto inexistente', async () => {
      const response = await request(app)
        .post('/stockmovements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          tipo: 'entrada',
          quantidade: 10,
          produtoId: 999999
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve falhar com campos faltando', async () => {
      const response = await request(app)
        .post('/stockmovements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          tipo: 'entrada'
          // Faltando quantidade e produtoId
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /stockmovements/:id', () => {
    test('Deve buscar movimentação por ID', async () => {
      // Pegar a primeira movimentação da lista
      const listResponse = await request(app)
        .get('/stockmovements')
        .set('Authorization', `Bearer ${adminToken}`);
      
      const firstMovementId = listResponse.body[0]?.id;
      
      if (!firstMovementId) {
        console.warn('Nenhuma movimentação encontrada para testar');
        return;
      }

      const response = await request(app)
        .get(`/stockmovements/${firstMovementId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', firstMovementId);
      expect(response.body).toHaveProperty('tipo');
      expect(response.body).toHaveProperty('produto');
    });

    test('Deve retornar 404 para ID inexistente', async () => {
      const response = await request(app)
        .get('/stockmovements/999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /stockmovements/:id', () => {
    test('Estoquista NÃO deve excluir movimentação', async () => {
      const response = await request(app)
        .delete(`/stockmovements/${createdMovementId}`)
        .set('Authorization', `Bearer ${estoquistaToken}`);

      expect(response.status).toBe(403);
    });

    test('Admin deve excluir movimentação', async () => {
      const response = await request(app)
        .delete(`/stockmovements/${createdMovementId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    test('Deve retornar 404 ao excluir ID inexistente', async () => {
      const response = await request(app)
        .delete('/stockmovements/999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
