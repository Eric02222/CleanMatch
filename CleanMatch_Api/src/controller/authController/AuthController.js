    import bcrypt from "bcrypt";
    import crypto from "crypto";
    import { prismaClient } from "../../../prisma/prisma.js";
    import {
        signAccessToken,
        signRefreshToken,
        verifyRefresh,
    } from "../../utils/jwt.js";
    import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../../utils/validations.js";
    import { sendResetPasswordEmail } from "../../utils/mail.js";


    class AuthController {
        constructor() { }

        async forgotPassword(req, res, next) {
            try {
                const { email } = forgotPasswordSchema.parse(req.body);

                const usuario = await prismaClient.usuario.findUnique({ where: { email } });
                
                // For security, always respond with success even if email doesn't exist
                if (!usuario) {
                    return res.status(200).json({ message: "Se o email estiver cadastrado, você receberá um link de recuperação." });
                }

                // Generate reset token
                const resetToken = crypto.randomBytes(32).toString("hex");
                const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

                // Store in database
                await prismaClient.token.create({
                    data: {
                        token: hashedToken,
                        type: "reset",
                        usuarioId: usuario.id,
                        expiresAt,
                    },
                });

                // Send email
                await sendResetPasswordEmail(email, resetToken);

                return res.status(200).json({ message: "Se o email estiver cadastrado, você receberá um link de recuperação." });
            } catch (error) {
                if (error.name === "ZodError") {
                    return res.status(400).json({ error: error.errors[0].message });
                }
                next(error);
            }
        };

        async resetPassword(req, res, next) {
            try {
                const { token, novaSenha } = resetPasswordSchema.parse(req.body);
                const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

                const storedToken = await prismaClient.token.findFirst({
                    where: {
                        token: hashedToken,
                        type: "reset",
                        revoked: false,
                        expiresAt: { gt: new Date() }
                    },
                    include: { usuario: true }
                });

                if (!storedToken) {
                    return res.status(400).json({ error: "Token inválido ou expirado" });
                }

                // Update password
                const saltRounds = 10;
                const hashedSenha = await bcrypt.hash(novaSenha, saltRounds);

                await prismaClient.usuario.update({
                    where: { id: storedToken.usuarioId },
                    data: { senha: hashedSenha }
                });

                // Revoke token after use
                await prismaClient.token.update({
                    where: { id: storedToken.id },
                    data: { revoked: true }
                });

                return res.status(200).json({ message: "Senha alterada com sucesso!" });
            } catch (error) {
                if (error.name === "ZodError") {
                    return res.status(400).json({ error: error.errors[0].message });
                }
                next(error);
            }
        };

        async register(req, res, next) {
            try {
                const validatedData = registerSchema.parse(req.body);
                const { senha, email, ...otherData } = validatedData;

                const existingUser = await prismaClient.usuario.findUnique({
                    where: { email },
                });
                
                if (existingUser) {
                    return res.status(409).json({ error: "Usuário já existe" });
                }

                const saltRounds = 10;
                const hashedsenha = await bcrypt.hash(senha, saltRounds);

                const usuario = await prismaClient.usuario.create({
                    data: { 
                        ...otherData,
                        email, 
                        senha: hashedsenha,
                        contato: otherData.contato || "",
                        cep: otherData.cep || "",
                        estado: otherData.estado || "",
                        cidade: otherData.cidade || "",
                        rua: otherData.rua || "",
                        valor_min: otherData.valor_min || "",
                        valor_max: otherData.valor_max || "",
                        cargaHoraria_inicio: otherData.cargaHoraria_inicio || "",
                        cargaHoraria_fim: otherData.cargaHoraria_fim || "",
                        descricao: otherData.descricao || "",
                        foto_perfil: otherData.foto_perfil || null
                    },
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
                if (error.name === "ZodError") {
                    return res.status(400).json({ error: error.errors[0].message });
                }
                next(error);
            }
        };

        async login(req, res, next) {
            try {
                const { email, senha } = loginSchema.parse(req.body);

                const usuario = await prismaClient.usuario.findUnique({ where: { email } });
                
                if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
                    return res.status(401).json({ error: "Credenciais inválidas" });
                }

                const userPayload = {
                    id: usuario.id,
                    email: usuario.email,
                    nome: usuario.nome,
                    tipo_conta: usuario.tipo_conta
                };

                const accessToken = signAccessToken(userPayload);
                const refreshToken = signRefreshToken(userPayload);

                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);

                await prismaClient.token.create({
                    data: {
                        token: refreshToken,
                        type: "refresh",
                        usuarioId: usuario.id,
                        expiresAt,
                    },
                });

                const { senha: _, ...userWithoutPassword } = usuario;

                res.status(200).json({
                    accessToken,
                    refreshToken,
                    usuario: userWithoutPassword
                });
            } catch (error) {
                if (error.name === "ZodError") {
                    return res.status(400).json({ error: error.errors[0].message });
                }
                next(error);
            }
        };


        async refresh(req, res, next) {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

                const storedRefreshToken = await prismaClient.token.findFirst({
                    where: { token: refreshToken },
                    include: { usuario: true }
                });

                if (
                    !storedRefreshToken ||
                    storedRefreshToken.revoked ||
                    storedRefreshToken.expiresAt < new Date()
                ) {
                    return res.status(401).json({ error: "Invalid or expired refresh token" });
                }

                const payload = verifyRefresh(refreshToken);
                const userPayload = {
                    id: storedRefreshToken.usuario.id,
                    email: storedRefreshToken.usuario.email,
                    nome: storedRefreshToken.usuario.nome,
                    tipo_conta: storedRefreshToken.usuario.tipo_conta
                };

                const accessToken = signAccessToken(userPayload);
                return res.json({ accessToken });
            } catch (error) {
                next(error);
            }
        };

        async logout(req, res, next) {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

                const storedRefreshToken = await prismaClient.token.findFirst({
                    where: { token: refreshToken },
                });

                if (storedRefreshToken) {
                    await prismaClient.token.update({
                        where: { id: storedRefreshToken.id },
                        data: { revoked: true },
                    });
                }
                
                return res.status(200).json({ message: "Usuário deslogado!" });
            } catch (error) {
                next(error);
            }
        }
    }


    export const authController = new AuthController();