import request from 'supertest';
import express from 'express';
import cors from 'cors';
import router from '../src/routes/index.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

describe('Testes de Dashboard', () => {
  let adminToken;
  let estoquistaToken;

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

  describe('GET /dashboard', () => {
    test('Admin deve acessar dashboard com sucesso', async () => {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resumo');
      expect(response.body).toHaveProperty('alertas');
    });

    test('Estoquista deve acessar dashboard', async () => {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${estoquistaToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resumo');
      expect(response.body).toHaveProperty('alertas');
    });

    test('Dashboard deve conter resumo com estatísticas', async () => {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const { resumo } = response.body;
      expect(resumo).toHaveProperty('totalProdutos');
      expect(resumo).toHaveProperty('totalFornecedores');
      expect(resumo).toHaveProperty('totalMovimentacoes');
      expect(resumo).toHaveProperty('totalEntradas');
      expect(resumo).toHaveProperty('totalSaidas');

      // Verificar tipos
      expect(typeof resumo.totalProdutos).toBe('number');
      expect(typeof resumo.totalFornecedores).toBe('number');
      expect(typeof resumo.totalMovimentacoes).toBe('number');
      expect(typeof resumo.totalEntradas).toBe('number');
      expect(typeof resumo.totalSaidas).toBe('number');
    });

    test('Dashboard deve conter alertas de estoque mínimo', async () => {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const { alertas } = response.body;
      expect(Array.isArray(alertas)).toBe(true);
      
      // Se houver alertas, verificar estrutura
      if (alertas.length > 0) {
        alertas.forEach(alerta => {
          expect(alerta).toHaveProperty('id');
          expect(alerta).toHaveProperty('nome');
          expect(alerta).toHaveProperty('sku');
          expect(alerta).toHaveProperty('estoqueAtual');
          expect(alerta).toHaveProperty('estoqueMinimo');
          
          // Verificar se está realmente abaixo do mínimo
          expect(alerta.estoqueAtual).toBeLessThan(alerta.estoqueMinimo);
        });
      }
    });

    test('Dashboard deve ter estrutura válida mesmo sem alertas', async () => {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.alertas).toBeDefined();
      expect(Array.isArray(response.body.alertas)).toBe(true);
    });

    test('Deve falhar sem autenticação', async () => {
      const response = await request(app)
        .get('/dashboard');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve falhar com token inválido', async () => {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', 'Bearer token_invalido');

      expect(response.status).toBe(401);
    });
  });

  describe('Validação de Cálculos do Dashboard', () => {
    test('Total de movimentações deve ser soma de entradas e saídas', async () => {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const { resumo } = response.body;
      const somaCalculada = resumo.totalEntradas + resumo.totalSaidas;
      
      expect(resumo.totalMovimentacoes).toBe(somaCalculada);
    });

    test('Estatísticas devem ser números não negativos', async () => {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const { resumo } = response.body;
      
      expect(resumo.totalProdutos).toBeGreaterThanOrEqual(0);
      expect(resumo.totalFornecedores).toBeGreaterThanOrEqual(0);
      expect(resumo.totalMovimentacoes).toBeGreaterThanOrEqual(0);
      expect(resumo.totalEntradas).toBeGreaterThanOrEqual(0);
      expect(resumo.totalSaidas).toBeGreaterThanOrEqual(0);
    });
  });
});
