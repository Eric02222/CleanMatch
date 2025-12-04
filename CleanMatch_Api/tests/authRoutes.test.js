import request from 'supertest';
import app from '../src/app.js';
import { prismaClient } from '../prisma/prisma.js'; 
import { auth } from '../src/middleware/auth.js'; 

// Variáveis globais para armazenar dados gerados nos testes
let usuarioPadrao;
let accessToken;
let refreshToken;
const SENHA_PADRAO = 'senha123Teste'; // Senha a ser usada e hasheada

// Campos obrigatórios do Model Usuario
const camposPadroes = {
    contato: "", cep: "", estado: "", cidade: "", rua: "", 
    valor_min: "", valor_max: "", cargaHoraria_inicio: "", 
    cargaHoraria_fim: "", descricao: ""
};

// --- SUÍTE DE TESTES ---
describe('Integração: AuthController (Rotas Reais)', () => {

    // Limpa ambas as tabelas (Usuário e Token)
    beforeEach(async () => {
        await prismaClient.token.deleteMany();
        await prismaClient.usuario.deleteMany();

        // 1. Cria um usuário de teste (sem hash, pois o login que fará a verificação)
        // OBS: Usamos o método POST /register para criar o usuário via rota
        const registerResponse = await request(app)
            .post('/register')
            .send({
                nome: "Usuario Padrão Teste",
                email: "padrao@teste.com",
                senha: SENHA_PADRAO,
                tipo_conta: "admin",
                ...camposPadroes
            });

        // Garantir que o setup foi bem sucedido
        expect(registerResponse.status).toBe(201);
        usuarioPadrao = registerResponse.body;
        
        // 2. Realiza o login para obter tokens para os testes protegidos
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: "padrao@teste.com",
                senha: SENHA_PADRAO
            });

        // Garantir que o login foi bem sucedido
        expect(loginResponse.status).toBe(200);
        accessToken = loginResponse.body.accessToken;
        refreshToken = loginResponse.body.refreshToken;
    });

    afterAll(async () => {
        await prismaClient.$disconnect();
    });

    // -----------------------------------------------------------------
    // TESTE DE REGISTRO (POST /register) - Cenário Negativo
    // -----------------------------------------------------------------
    test('Não deve registrar usuário com email existente (POST /register)', async () => {
        // Tenta registrar com o email do usuarioPadrao que o beforeEach já criou
        const response = await request(app)
            .post('/register')
            .send({
                nome: "Duplicado",
                email: usuarioPadrao.email,
                senha: SENHA_PADRAO,
                tipo_conta: "client"
            });

        // Expect 1: Status de Conflito
        expect(response.status).toBe(409);

        // Expect 2: Mensagem de erro
        expect(response.body.error).toBe("Usuário já existe");

        // Expect 3: Confere se apenas 1 usuário existe no banco
        const count = await prismaClient.usuario.count();
        expect(count).toBe(1);
    });

    // -----------------------------------------------------------------
    // TESTES DE LOGIN (POST /login) - Cenário Negativo
    // -----------------------------------------------------------------
    test('Não deve logar com senha inválida (POST /login)', async () => {
        // Tenta logar usando o usuário criado, mas com a senha errada
        const response = await request(app)
            .post('/login')
            .send({
                email: usuarioPadrao.email,
                senha: 'senhaErrada' 
            });

        // Expect 1: Status de Não Autorizado
        expect(response.status).toBe(401);

        // Expect 2: Mensagem de erro
        expect(response.body.error).toBe("Credenciais inválidas");

        // Expect 3: NENHUM novo token deve ser salvo no banco
        const tokensCount = await prismaClient.token.count();
        expect(tokensCount).toBe(1); // Já existia 1 token do setup, mas nenhum novo
    });

    // -----------------------------------------------------------------
    // TESTES DE LOGOUT (POST /auth/logout)
    // -----------------------------------------------------------------
    test('Deve invalidar o refresh token e deslogar (POST /auth/logout)', async () => {
        const response = await request(app)
            .post('/auth/logout')
            .send({ refreshToken }); // Usa o token gerado no setup

        // Expect 1: Status de Sucesso
        expect(response.status).toBe(200);

        // Expect 2: Mensagem de retorno
        expect(response.body).toBe("Usuário deslogado!");

        // Expect 3: O token no banco deve estar REVOGADO
        const tokenDB = await prismaClient.token.findFirst({
            where: { token: refreshToken }
        });
        expect(tokenDB.revoked).toBe(true);
    });

    // -----------------------------------------------------------------
    // TESTES DE REFRESH (POST /auth/refresh)
    // -----------------------------------------------------------------
    test('Deve gerar um novo access token com refresh token válido (POST /auth/refresh)', async () => {
        const response = await request(app)
            .post('/auth/refresh')
            .send({ refreshToken }); // Usa o token gerado no setup

        // Expect 1: Status Sucesso
        expect(response.status).toBe(200);

        // Expect 2: Retorna um novo access token (que deve ser diferente do original)
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.accessToken).not.toBe(accessToken);

        // Expect 3: O token no banco não deve ter sido revogado
        const tokenDB = await prismaClient.token.findFirst({
            where: { token: refreshToken }
        });
        expect(tokenDB.revoked).toBe(false);
    });
});