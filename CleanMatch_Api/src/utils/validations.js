import { z } from "zod";

export const registerSchema = z.object({
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    tipo_conta: z.enum(["CLIENTE", "PROFISSIONAL"], {
        errorMap: () => ({ message: "Tipo de conta deve ser CLIENTE ou PROFISSIONAL" })
    }),
    contato: z.string().optional(),
    cep: z.string().optional(),
    estado: z.string().optional(),
    cidade: z.string().optional(),
    rua: z.string().optional(),
    valor_min: z.string().optional(),
    valor_max: z.string().optional(),
    cargaHoraria_inicio: z.string().optional(),
    cargaHoraria_fim: z.string().optional(),
    descricao: z.string().optional(),
    foto_perfil: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(1, "Senha é obrigatória"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token é obrigatório"),
    novaSenha: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres"),
});

