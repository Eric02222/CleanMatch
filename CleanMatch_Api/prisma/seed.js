import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.usuario.createMany({
        data: [
            {   
                nome: "marco",
                email: "marc@gmail.com", 
                senha: "123",
                cargo: "Médico"
            }
        ]
    });

    await prisma.paciente.create({
        data: {
            nome: "Joao",
            sexo: "Masculino",
            data_nascimento: new Date("1980-12-11"),
            cpf: "958.521.251-65",
            telefone: 99525562,
            email: "joao@gmail.com",
            // consulta: {
            //     create: [
            //         {
            //             motivo: "Dor nas constas",
            //             data_consulta: new Date("2023-08-25"),
            //             descricao: "Dores fortes nas costas",
            //             obsevacao: "Ibuprofeno 3 vezes ao dia"
            //         }
            //     ]
            // },
            // exame: {
            //     create: [
            //         {   
            //             nome: "Densiometro",
            //             data_exame: new Date("2023-08-25"),
            //             tipo: "clinico",
            //             resultado: "deu ruim",
            //             link_arquivo: "url.com.br/exame.pdf",
            //             observacoes: ""
            //         }
            //     ]
            // },
        }
    })
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });