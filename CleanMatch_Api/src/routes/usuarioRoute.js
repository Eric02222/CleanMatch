import { Router } from 'express';
import { usuarioController } from '../controller/Usuario/UsuarioController.js';

export const usuarioRouter = Router();

usuarioRouter.get(
    "/usuarios",
    /*
      #swagger.tags = ['Usuários']
      #swagger.summary = 'Lista todos os usuários'
      #swagger.security = [{ "bearerAuth": [] }]
    */
    usuarioController.getTodosOsUsuarios
);

usuarioRouter.get(
    "/usuarios/byemail",
    /*
      #swagger.tags = ['Usuários']
      #swagger.summary = 'Busca usuário pelo e-mail'
      #swagger.parameters['email'] = {
        in: 'query',
        type: 'string',
        required: true
      }
      #swagger.security = [{ "bearerAuth": [] }]
    */
    usuarioController.getUsuarioPorEmail
);

usuarioRouter.get(
    "/usuarios/:id",
    /*
      #swagger.tags = ['Usuários']
      #swagger.summary = 'Busca um usuário pelo ID'
      #swagger.parameters['id'] = {
        in: 'path',
        type: 'integer',
        required: true
      }
      #swagger.security = [{ "bearerAuth": [] }]
    */
    usuarioController.getUsuarioPorId
);

usuarioRouter.post(
    "/usuarios",
    /*
      #swagger.tags = ['Usuários']
      #swagger.summary = 'Cria um novo usuário'
      #swagger.security = [{ "bearerAuth": [] }]
    */
    usuarioController.criarUsuario
);

usuarioRouter.put(
    "/usuarios/:id",
    /*
      #swagger.tags = ['Usuários']
      #swagger.summary = 'Atualiza um usuário pelo ID'
      #swagger.security = [{ "bearerAuth": [] }]
    */
    usuarioController.atualizarUsuario
);

usuarioRouter.delete(
    "/usuarios/:id",
    /*
      #swagger.tags = ['Usuários']
      #swagger.summary = 'Deleta um usuário pelo ID'
      #swagger.security = [{ "bearerAuth": [] }]
    */
    usuarioController.deletarUsuario
);