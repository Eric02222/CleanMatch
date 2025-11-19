import { prismaClient } from '../../../prisma/prisma.js';

class UsuarioController {

    constructor() { }
    async getTodosOsUsuarios(req, res) {
        const { page, limit } = req.query

        const pageNumber = Number(page);
        const pageLimit = Number(limit);
        try {
            const usuarios = await prismaClient.usuario.findMany({               
                skip: (pageNumber - 1) * pageLimit,
                take: pageLimit,
            });
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
            const { body, params } = req
            if (body.nome || body.email || body.senha || body.contato || body.tipo_conta || body.cep || body.estado || body.cidade || body.valor_min || body.valor_max 
                || body.cargaHoraria_inicio || body.cargaHoraria_fim || body.descricao || body.foto_perfil) {
                await prismaClient.usuario.update({
                    where: { id: Number(params.id) },
                    data: {
                        ...body
                    },
                })

                const usuarioAtualizado = await prismaClient.usuario.findUnique({
                    where: {
                        id: Number(params.id)
                    }
                })

                res.status(201).json({
                    message: "Usuário atualizado!",
                    data: usuarioAtualizado
                })
            } else {
                res.status(404).send("Atributos enviados não condizem com o schema")
            }
        } catch (error) {
            if (error.code == "P2025") {
                res.status(404).send("Usuário não existe no banco")
            }
            if (error.code === "P2002") {
                res.status(404).send("Falha ao cadastrar usuário: Email já cadastrado!")
            }
        }
    }

    async deletarUsuario(req, res) {
        const { params } = req
        try {
            const usuarioDeletado = await prismaClient.usuario.delete({
                where: {
                    id: Number(params.id),
                },
            })
            res.status(200).json({
                message: "Usuário deletado!",
                data: usuarioDeletado
            })
        } catch (error) {
            if (error.code == "P2025") {
                res.status(404).send("Usuário não existe no banco")
            }
        }
    }


}
export const usuarioController = new UsuarioController();