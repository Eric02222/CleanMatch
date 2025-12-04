import request from 'supertest';
import { app } from '../src/app.js';
import { prismaClient } from '../prisma/prisma.js';

describe('Integração: UsuarioController e Rotas API', () => {

    let usuarioPadrao;
    const camposPadroes = {
        contato: "",
        cep: "",
        estado: "",
        cidade: "",
        rua: "",
        valor_min: "",
        valor_max: "",
        cargaHoraria_inicio: '',
        cargaHoraria_fim: '',
        descricao: "",
        foto_perfil: 'teste'
    };

    // Antes de CADA teste: Limpa o banco e cria um usuário padrão
    beforeEach(async () => {
        // Limpeza (essencial para isolar testes)
        await prismaClient.usuario.deleteMany();

        // Criação do usuário comum
        usuarioPadrao = await prismaClient.usuario.create({
            data: {
                nome: "Usuário Padrão",
                email: "padrao@email.com",
                senha: "123",
                tipo_conta: "cliente",
                ...camposPadroes // Espalha os campos obrigatórios vazios
            }
        });
    });

    afterAll(async () => {
        await prismaClient.$disconnect();
    });

    beforeAll(async () => {
        // Opcional: Limpar a tabela antes de todos os testes
        await prismaClient.usuario.deleteMany({});
      });
      
      afterEach(async () => {
        // Garante que cada teste comece com um estado limpo,
        // ou limpa o registro recém-criado para o próximo teste
        await prismaClient.usuario.deleteMany({});
      });

    // -----------------------------------------------------------------
    // TESTES DE CRIAÇÃO (POST /usuarios)
    // -----------------------------------------------------------------
    test('Deve criar um NOVO usuário com sucesso (POST /usuarios)', async () => {
        const novoUsuario = {
            nome: "Novo Teste",
            email: "novo@email.com",
            senha: "abc",
            tipo_conta: "cliente",
            ...camposPadroes
        };

        const response = await request(app)
            .post('/usuarios')
            .send(novoUsuario);

        // Expect 1: Status 201 Created
        expect(response.status).toBe(201);

        // Expect 2: Confere se o email retornado é o correto e possui ID
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(novoUsuario.email);

        // Expect 3: Verifica se REALMENTE gravou no banco
        const usuarioNoBanco = await prismaClient.usuario.findUnique({
            where: { email: "novo@email.com" }
        });
        expect(usuarioNoBanco).toBeTruthy();
        expect(usuarioNoBanco.nome).toBe("Novo Teste");
    });

    test('Não deve criar usuário com email repetido (POST /usuarios)', async () => {
        // Tenta criar usando o email do 'usuarioPadrao' que o beforeEach já criou
        const response = await request(app)
            .post('/usuarios')
            .send({
                nome: "Tentativa Duplicada",
                email: usuarioPadrao.email,
                senha: "456",
                tipo_conta: "cliente",
                ...camposPadroes
            });

        // Expect 1: Status 404 (conforme sua lógica P2002)
        expect(response.status).toBe(404);

        // Expect 2: Mensagem de erro específica
        expect(response.text).toBe("Falha ao cadastrar usuário: Email já cadastrado!");

        // Expect 3: O banco deve continuar tendo apenas 1 usuário
        const count = await prismaClient.usuario.count({
            where: { email: usuarioPadrao.email }
        });
        expect(count).toBe(1);
    });

    // -----------------------------------------------------------------
    // TESTES DE LEITURA (GET /usuarios, GET /usuarios/:id)
    // -----------------------------------------------------------------
    test('Deve listar todos os usuários (GET /usuarios)', async () => {
        const response = await request(app).get('/usuarios');

        // Expect 1: Status 200
        expect(response.status).toBe(200);

        // Expect 2: Deve ser um array contendo 1 usuário
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);

        // Expect 3: O usuário encontrado deve ser o padrão
        expect(response.body[0].email).toBe(usuarioPadrao.email);
        expect(response.body[0].nome).toBe(usuarioPadrao.nome);
    });

    test('Deve buscar o usuário padrão pelo ID (GET /usuarios/:id)', async () => {
        const response = await request(app).get(`/usuarios/${usuarioPadrao.id}`);

        // Expect 1: Status Sucesso
        expect(response.status).toBe(200);

        // Expect 2: Dados batem com o usuário padrão
        expect(response.body.id).toBe(usuarioPadrao.id);
        expect(response.body.nome).toBe(usuarioPadrao.nome);

        // Expect 3: O campo senha deve ser uma string (apesar de não retornar a senha no update, aqui ela é retornada)
        expect(typeof response.body.senha).toBe('string');
    });

    // ROTA ATUALIZADA AQUI: /usuarios/byemail
    test('Deve buscar usuário por email via query param (GET /usuarios/byemail?email=...)', async () => {
        const response = await request(app).get(`/usuarios/byemail?email=${usuarioPadrao.email}`);

        // Expect 1: Status
        expect(response.status).toBe(200);

        // Expect 2: Email no body deve ser o esperado
        expect(response.body.email).toBe(usuarioPadrao.email);

        // Expect 3: Verifica se o tipo de conta está correto
        expect(response.body.tipo_conta).toBe("cliente");
    });

    // -----------------------------------------------------------------
    // TESTES DE ATUALIZAÇÃO (PUT /usuarios/:id)
    // -----------------------------------------------------------------
    test('Deve atualizar o nome e a cidade do usuário padrão (PUT /usuarios/:id)', async () => {
        const dadosAtualizacao = {
            nome: "Nome Editado",
            cidade: "Curitiba"
        };

        const response = await request(app)
            .put(`/usuarios/${usuarioPadrao.id}`)
            .send(dadosAtualizacao);

        // Expect 1: Status 200
        expect(response.status).toBe(200);

        // Expect 2: Body da resposta reflete atualização e não tem senha
        expect(response.body.message).toBe("Usuário atualizado!");
        expect(response.body.data.nome).toBe("Nome Editado");
        expect(response.body.data).not.toHaveProperty('senha'); // Seu controller remove a senha na resposta do update

        // Expect 3: Verifica persistência no Banco de Dados
        const usuarioNoBanco = await prismaClient.usuario.findUnique({
            where: { id: usuarioPadrao.id }
        });
        expect(usuarioNoBanco.nome).toBe("Nome Editado");
        expect(usuarioNoBanco.cidade).toBe("Curitiba");
    });

    test('Deve retornar 404 se o usuário a ser atualizado não existir (PUT /usuarios/:id)', async () => {
        const response = await request(app)
            .put('/usuarios/999999') // ID que certamente não existe
            .send({ nome: "Inexistente" });

        // Expect 1: Status 404 (Erro P2025)
        expect(response.status).toBe(404);

        // Expect 2: Mensagem de erro
        expect(response.text).toBe("Usuário não encontrado.");

        // Expect 3: O usuário padrão não deve ter sido alterado
        const usuario = await prismaClient.usuario.findUnique({ where: { id: usuarioPadrao.id } });
        expect(usuario.nome).toBe("Usuário Padrão");
    });

    // -----------------------------------------------------------------
    // TESTES DE DELEÇÃO (DELETE /usuarios/:id)
    // -----------------------------------------------------------------
    test('Deve deletar o usuário padrão com sucesso (DELETE /usuarios/:id)', async () => {
        const response = await request(app).delete(`/usuarios/${usuarioPadrao.id}`);

        // Expect 1: Status 200
        expect(response.status).toBe(200);

        // Expect 2: Mensagem de sucesso
        expect(response.body.message).toBe("Usuário deletado com sucesso!");

        // Expect 3: Verifica se sumiu do banco
        const usuarioNoBanco = await prismaClient.usuario.findUnique({
            where: { id: usuarioPadrao.id }
        });
        expect(usuarioNoBanco).toBeNull();
    });

    test('Deve retornar 404 se o usuário a ser deletado não existir (DELETE /usuarios/:id)', async () => {
        const response = await request(app).delete('/usuarios/888888'); // ID inexistente

        // Expect 1: Status 404 (Erro P2025)
        expect(response.status).toBe(404);

        // Expect 2: Mensagem de erro específica
        expect(response.body.message).toBe("Usuário não encontrado no banco.");

        // Expect 3: O número total de usuários deve permanecer 1
        const count = await prismaClient.usuario.count();
        expect(count).toBe(1);
    });
});