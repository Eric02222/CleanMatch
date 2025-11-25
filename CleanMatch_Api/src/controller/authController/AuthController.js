import bcrypt from "bcrypt";
import { prismaClient } from "../../../prisma/prisma.js";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefresh,
} from "../../utils/jwt.js";


class AuthController {
    constructor() { }

    async register(
        req,
        res
    ) {
        try {
            const { nome, email, senha, tipo_conta, contato = "", cep = "", estado = "", cidade = "", rua = "", valor_min = "", valor_max = "", cargaHoraria_inicio = '', cargaHoraria_fim = '', descricao = "", foto_perfil = 'teste' } = req.body;
            // Validação básica
            if (!email || !senha) {
                return res.status(400).json({ error: "Email e senha são obrigatórios" });
            }
            // Verificar se usuário já existe
            const existingUser = await prismaClient.usuario.findUnique({
                where: { email },
            });
            if (existingUser) {
                return res.status(409).json({ error: "Usuário já existe" });
            }
            console.log(senha)

            // Hash da senha com bcrypt
            const saltRounds = 10;
            const hashedsenha = await bcrypt.hash(senha, saltRounds);
            console.log(hashedsenha)
            // Criar usuário no banco de dados
            const usuario = await prismaClient.usuario.create({
                data: { nome: nome, email: email, senha: hashedsenha, tipo_conta: tipo_conta, contato: contato, cep: cep, estado: estado, cidade: cidade,rua: rua,  valor_min:valor_min, valor_max: valor_max, cargaHoraria_inicio: cargaHoraria_inicio, cargaHoraria_fim: cargaHoraria_fim, descricao: descricao, foto_perfil: foto_perfil || null },
                select: {
                    id: true,
                    email: true,
                    nome: true,
                    tipo_conta: true,
                    contato: true,
                    cep: true,
                    estado: true,
                    cidade: true,
                    rua: true,
                    valor_min: true,
                    valor_max: true,
                    cargaHoraria_inicio: true,
                    cargaHoraria_fim: true,
                    descricao: true,
                    foto_perfil: true,
                },
            });
            return res.status(201).json(usuario);
        } catch (error) {
            console.error("Erro no registro:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res.status(400).send("Not Found");
    };

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const usuario = await prismaClient.usuario.findUnique({ where: { email } }); // Verificar se usuário existe e senha está correta
            if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
                return res.status(401).json({ error: "Credenciais inválidas" });
            }
            // Gerar access token (curta duração)
            const accessToken = signAccessToken({
                usuarioId: usuario.id,
                email: usuario.email,
                nome: usuario.nome,

            });

            // Gerar refresh token (longa duração)
            const refreshToken = signRefreshToken({
                usuarioId: usuario.id,
                email: usuario.email,
                nome: usuario.nome,

            });
            // Armazenar refresh token no banco de dados
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            console.log(refreshToken)
            await prismaClient.token.create({
                data: {
                    token: refreshToken,
                    type: "refresh",
                    usuarioId: usuario.id,
                    expiresAt,
                },
            });
            res.status(200).json({
                accessToken,
                refreshToken,
                usuario: {
                    usuarioId: usuario.id,
                    email: usuario.email,
                    nome: usuario.nome,

                },
            });
        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res;
    };


    async refresh(
        req,
        res
    ) {
        const { refreshToken } = req.body;
        const storedRefreshToken = await prismaClient.token.findFirst({
            where: { token: refreshToken },
        });
        if (
            !storedRefreshToken ||
            storedRefreshToken.revoked ||
            storedRefreshToken.expiresAt < new Date()
        )
            return res.status(401).json({ error: "invalid refresh token" });

        try {
            const payload = verifyRefresh(refreshToken);
            const accessToken = signAccessToken({
                userId: payload.id,
                email: payload.email,
                nome: payload.nome,
            });
            return res.json({ accessToken });
        } catch {
            return res.status(401).json({ error: "invalid refresh token" });
        }
    };

    async logout(
        req,
        res
    ) {
        const { refreshToken } = req.body;
        console.log(refreshToken)
        try {
            const storedRefreshToken = await prismaClient.token.findFirst({
                where: { token: refreshToken },
            });
            console.log(storedRefreshToken)
            if (
                !storedRefreshToken ||
                storedRefreshToken.revoked ||
                storedRefreshToken.expiresAt < new Date()
            )
                return res.status(401).json({ error: "invalid refresh token" });

            await prismaClient.token.updateMany({
                where: { id: storedRefreshToken?.id ?? 0 },
                data: { revoked: true },
            });
            console.log("teste")
            return res.status(200).json("Usuário deslogado!");

        } catch (error) {
            res.status(400).json(error)
        }
    }
}


export const authController = new AuthController();