import request from 'supertest';
import express from 'express';
import cors from 'cors';
import router from '../src/routes/index.routes.js';

// Configurar app para testes
const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

describe('Testes de Autenticação', () => {
  let adminToken;
  let estoquistaToken;
  const testEmail = `test-${Date.now()}@test.com`;

  describe('POST /auth/register', () => {
    test('Deve registrar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Usuário Teste',
          email: testEmail,
          password: '123456',
          role: 'estoquista'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user.role).toBe('estoquista');
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('Deve falhar ao registrar com email duplicado', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Admin Teste',
          email: 'admin@stocksync.com', // Email já existe
          password: '123456',
          role: 'admin'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve falhar ao registrar sem campos obrigatórios', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Teste Incompleto'
          // Faltando email e password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve falhar ao registrar com role inválido', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Teste Role',
          email: `role-${Date.now()}@test.com`,
          password: '123456',
          role: 'superadmin' // Role inválido
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Erro de validação');
      expect(response.body.detalhes).toBeDefined();
      expect(response.body.detalhes.some(d => d.campo === 'role')).toBe(true);
    });
  });

  describe('POST /auth/login', () => {
    test('Deve fazer login com admin com sucesso', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@stocksync.com',
          password: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.role).toBe('admin');
      
      adminToken = response.body.token; // Salvar para outros testes
    });

    test('Deve fazer login com estoquista com sucesso', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'maria.estoquista@stocksync.com',
          password: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.role).toBe('estoquista');
      
      estoquistaToken = response.body.token; // Salvar para outros testes
    });

    test('Deve falhar com email inexistente', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'naoexiste@test.com',
          password: '123456'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve falhar com senha incorreta', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@stocksync.com',
          password: 'senhaerrada'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve falhar sem credenciais', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Validação de Token JWT', () => {
    test('Deve acessar rota protegida com token válido', async () => {
      const response = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    test('Deve falhar sem token', async () => {
      const response = await request(app)
        .get('/products');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Token não fornecido');
    });

    test('Deve falhar com token inválido', async () => {
      const response = await request(app)
        .get('/products')
        .set('Authorization', 'Bearer token_invalido');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('inválido');
    });

    test('Deve falhar com token mal formatado', async () => {
      const response = await request(app)
        .get('/products')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('mal formatado');
    });
  });
});
