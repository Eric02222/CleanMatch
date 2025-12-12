import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function geradorDeUsuarios() {
    const usuariosData = [];
    const senhaPadrao = 'SenhaSegura123!';
    // Hash da senha padrão uma única vez
    const hashedPassword = await bcrypt.hash(senhaPadrao, 10);

    for (let i = 1; i <= 35; i++) {
        // --- Configuração para Prestador ---
        const tipoConta = 'Prestador/a de Serviço'; 
        
        // Variação de valores (ex: 50.00 até 600.00)
        const valorMin = (50 + (i % 10) * 5).toFixed(2);
        const valorMax = (200 + (i % 10) * 40).toFixed(2);
        
        // Variação de carga horária
        const cargaHorariaInicio = i % 3 === 0 ? '07:00' : '08:00';
        const cargaHoraria_fim = i % 3 === 0 ? '16:00' : '17:00';

        const descricao = `Prestador ${i} - Limpeza completa.`;
        
        // Variação de localização (usando 3 estados e cidades)
        let estado, cidade, cepBase;
        if (i % 3 === 1) {
            estado = 'SP'; cidade = 'São Paulo'; cepBase = '01000';
        } else if (i % 3 === 2) {
            estado = 'RJ'; cidade = 'Rio de Janeiro'; cepBase = '20000';
        } else {
            estado = 'MG'; cidade = 'Belo Horizonte'; cepBase = '30000';
        }

        usuariosData.push({
            nome: `Prestador de Serviço ${i}`,
            email: `prestador${i}@servico.com`,
            senha: hashedPassword,
            contato: `(11) 9${String(90000000 + i).padStart(7, '0')}`,
            tipo_conta: tipoConta,
            cep: `${cepBase}-${String(i).padStart(3, '0')}`,
            estado: estado,
            cidade: cidade,
            rua: `Avenida do Serviço, ${i * 10}`,
            valor_min: valorMin,
            valor_max: valorMax,
            cargaHoraria_inicio: cargaHorariaInicio,
            cargaHoraria_fim: cargaHoraria_fim,
            descricao: descricao,
            foto_perfil: '',
        });
    }

    return usuariosData;
}

async function main() {
   const usuariosParaCriar = await geradorDeUsuarios();

   await prisma.usuario.createMany({
        data: usuariosParaCriar,
        skipDuplicates: true, 
    });
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });