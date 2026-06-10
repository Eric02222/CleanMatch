# CleanMatch ✨

> **Conectando profissionais da limpeza a quem mais precisa.**

O **CleanMatch** é uma plataforma desenvolvida para facilitar o encontro entre prestadores de serviços de limpeza e clientes que buscam praticidade e confiança na contratação. Nosso objetivo é simplificar o processo de locação de serviços, oferecendo uma interface intuitiva e funcionalidades que garantem segurança para ambos os lados.

---

## 🚀 Funcionalidades Principais

- **Gestão de Usuários:** Cadastro, login e perfil personalizado para clientes e prestadores.
- **Divulgação de Serviços:** Prestadores podem postar seus serviços com valores ajustáveis de acordo com o tipo de trabalho e localização.
- **Autenticação Segura:** Sistema robusto utilizando JWT (JSON Web Tokens) e criptografia de senhas com Bcrypt.
- **Notificações por E-mail:** Integração para envio de comunicações essenciais.
- **Documentação Interativa:** API totalmente documentada com Swagger para facilitar a integração e testes.

### 📅 Em breve (Roadmap)
- [ ] Sistema de avaliações e feedbacks.
- [ ] Filtro de busca por geolocalização.
- [ ] Chat interno para negociação direta.
- [ ] Adição de itens extras ao serviço solicitado.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** (Vite)
- **Tailwind CSS** (Estilização Moderna)
- **React Router 7** (Navegação)
- **Axios** (Consumo de API)
- **React Toastify** (Notificações visuais)

### Backend
- **Node.js** com **Express**
- **Prisma ORM** (Modelagem de dados)
- **MySQL** (Banco de dados relacional)
- **Zod** (Validação de esquemas)
- **Swagger UI** (Documentação da API)
- **Nodemailer** (Serviço de e-mail)

### Testes & Qualidade
- **Jest** & **Supertest**
- **ESLint** (Padronização de código)

---

## 📦 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado
- MySQL Server rodando

### 1. Clonar o Repositório
```bash
git clone https://github.com/Eric02222/CleanMatch.git
cd CleanMatch
```

### 2. Configurar o Backend
```bash
cd CleanMatch_Api
npm install
```
- Crie um arquivo `.env` na pasta `CleanMatch_Api` seguindo o modelo:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/cleanmatch"
ACCESS_TOKEN_SECRET="sua_chave_secreta"
REFRESH_TOKEN_SECRET="sua_chave_secreta_refresh"
MAIL_HOST="seu_servidor_smtp"
MAIL_PORT=587
MAIL_USER="seu_email"
MAIL_PASS="sua_senha"
```
- Execute as migrações do banco:
```bash
npx prisma migrate dev
```
- Inicie o servidor:
```bash
npm start
```

### 3. Configurar o Frontend
```bash
# Em um novo terminal, na raiz do projeto
npm install
npm run dev
```

---

## 📄 Documentação da API
Após iniciar o backend, você pode acessar a documentação interativa em:
`http://localhost:4000/api-docs`

---

## 👥 Equipe
Desenvolvido como parte da Situação de Aprendizagem do curso técnico de Desenvolvimento de Sistemas do SENAI.

- [Eric Mara de Oliveira](https://github.com/Eric02222)
- [Vitor Carlos Souza da Rocha Pinto](https://github.com/OracleThe61)
- [Bryan Demis Alves de Andrade](https://github.com/brryan64d)
- [Nicolas Corrêa Gubert](https://github.com/correagubert)

---

## 📄 Licença
Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
