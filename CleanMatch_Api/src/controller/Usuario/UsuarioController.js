import { prismaClient } from '../../../prisma/prisma.js';

class UsuarioController {

    constructor() { }
    async getTodosOsUsuarios(req, res) {
        try {
            const usuarios = await prismaClient.usuario.findMany();
            return res.json(usuarios)
        }
        catch (e) {
            console.log(e)
        }
    }

    async getUsuarioPorId(req, res) {
        try {
            const { params } = req
            const usuario = await prismaClient.usuario.findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            if (!usuario) return res.status(404).send("Usuário não existe!")
            return res.json(usuario)
        }
        catch (e) {
            console.log(e)
        }
    }

    async getUsuarioPorEmail(req, res) {
        try {
            const email = String(req.query.email);
            const usuario = await prismaClient.usuario.findUnique({
                where: { email },
            });
            if (!usuario) return res.status(404).send("Usuário não existe!");
            return res.json(usuario);
        } catch (e) {
            console.error(" Erro em getUsuarioPorEmail:", e);
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    }

    async criarUsuario(req, res) {
        try {
            const { body } = req
            const usuario = await prismaClient.usuario.create({
                data: {
                    nome: body.nome,
                    email: body.email,
                    senha: body.senha,
                    tipo_conta: body.tipo_conta
                },
            })
            return res.status(201).json(usuario)
        } catch (error) {
            console.error(error)
            if (error.code === "P2002") {
                res.status(404).send("Falha ao cadastrar usuário: Email já cadastrado!")
            }
        }
    }

    async atualizarUsuario(req, res) {
    try {
        const { body, params } = req;
        const { token, id, ...dadosParaSalvar } = body;

        if (Object.keys(dadosParaSalvar).length === 0) {
             return res.status(400).send("Nenhum dado válido para atualizar.");
        }

        const usuarioAtualizado = await prismaClient.usuario.update({
            where: { id: Number(params.id) },
            data: dadosParaSalvar 
        });

        delete usuarioAtualizado.senha; 

        return res.status(200).json({
            message: "Usuário atualizado!",
            data: usuarioAtualizado
        });

    } catch (error) {
        console.error("Erro no Update:", error); 

        if (error.code === "P2025") {
            return res.status(404).send("Usuário não encontrado.");
        }
        if (error.code === "P2002") {
            return res.status(409).send("Email já cadastrado.");
        }
        return res.status(500).json({ 
            message: "Erro interno ao atualizar.",
            erroDetalhado: error.message 
        });
    }
}

   async deletarUsuario(req, res) {
    const { params } = req;
    console.log("Tentando deletar usuário ID:", params.id); 

    try {
        const usuarioDeletado = await prismaClient.usuario.delete({
            where: {
                id: Number(params.id),
            },
        });

        return res.status(200).json({
            message: "Usuário deletado com sucesso!",
            data: usuarioDeletado
        });

    } catch (error) {
        console.error("Erro ao deletar usuário:", error); 

        if (error.code === "P2025") {
            return res.status(404).json({ message: "Usuário não encontrado no banco." });
        }

        if (error.code === "P2003") {
            return res.status(400).json({ 
                message: "Não é possível excluir a conta pois existem dados vinculados (Tokens, Serviços, etc).",
                erro: "Violação de integridade referencial (Foreign Key)"
            });
        }

        return res.status(500).json({ 
            message: "Erro interno ao tentar excluir conta.",
            detalhes: error.message 
        });
    }
}
}
export const usuarioController = new UsuarioController();