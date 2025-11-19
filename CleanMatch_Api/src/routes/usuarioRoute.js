import { Router } from 'express';
import { usuarioController } from '../controller/Usuario/UsuarioController.js';

export const usuarioRouter = Router();

//tabela Usuario
usuarioRouter.get('/usuarios', usuarioController.getTodosOsUsuarios);

usuarioRouter.get("/usuarios/:id", usuarioController.getUsuarioPorId);

usuarioRouter.get("/usuarios/byemail", usuarioController.getUsuarioPorEmail);

usuarioRouter.post("/usuarios", usuarioController.criarUsuario);

usuarioRouter.put("/usuarios/:id", usuarioController.atualizarUsuario);

usuarioRouter.delete("/usuarios/:id", usuarioController.deletarUsuario);
