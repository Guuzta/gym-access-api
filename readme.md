# Sistema de Controle de Acesso com CI/CD, Docker e Deploy em VPS

Este projeto é uma API REST desenvolvida para simular o controle de acesso de uma academia, aplicando boas práticas de desenvolvimento backend moderno.

## 🚀 Sobre o projeto

O sistema conta com autenticação de um único administrador, responsável pelo gerenciamento da aplicação, e um conjunto de rotas protegidas para gerenciamento de usuários e geração de códigos de acesso. Esses códigos são utilizados posteriormente para validar a entrada de usuários na academia por meio de uma rota específica de verificação.

A aplicação foi containerizada com Docker e integrada a um pipeline de CI/CD automatizado, garantindo testes, build e deploy contínuo de forma segura e reprodutível. O objetivo principal do projeto foi simular um ambiente real de desenvolvimento, desde a implementação da aplicação até o deploy em uma VPS, reproduzindo um fluxo completo de entrega de software em produção.

## 🧠 Funcionalidades

- Autenticação de administrador (usuário único inicializado via seed)
- Login do administrador para acesso ao sistema
- CRUD completo de clientes:
  - criação com geração automática de código de acesso
  - listagem
  - edição
  - desativação (soft delete)
  - reativação
- Validação de dados de entrada com Zod
- Testes automatizados com Jest

## 🛠️ Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Jest
- Docker
- Docker Compose
- NGINX (reverse proxy)
- GitHub Actions (CI/CD)
- VPS Linux (Ubuntu)

## 🏗️ Arquitetura

O sistema segue uma arquitetura baseada em containers com separação de responsabilidades:

### 🔹 Runtime (produção)

![Runtime](./docs/runtime-architecture.png)

### 🔹 CI/CD (deploy)

![CI/CD](./docs/cicd-pipeline.png)

## 🐳 Como rodar o projeto localmente

> Instruções para executar o projeto em ambiente local utilizando Docker.

### Pré-requisitos:

Antes de começar, certifique-se de ter instalado:

- Docker
- Docker Compose
- Git
- Node.js

#### 1. Clonar o repositório

```bash
git clone https://github.com/Guuzta/gym-access-api.git
cd gym-access-api
```

#### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.development` baseado no exemplo abaixo:

```env
PORT=3000

DATABASE_URL="postgres://postgres:admin@postgres:5432/postgres"

TOKEN_SECRET=your_secret_here
TOKEN_EXPIRATION=10m

REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRATION=7d

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="adminPassword1234"
```

> ⚠️ Observação: a senha do admin precisa ter no mínimo 8 caracteres, caso contrário a validação com Zod irá impedir o login.

#### 3. Subir os containers:

```bash
docker compose -f docker-compose.dev.yml up -d
```

#### 4. Rodar migrations

Após subir os containers de desenvolvimento, execute as migrations utilizando o `docker-compose.dev.yml`:

```bash
docker compose -f docker-compose.dev.yml exec api npx prisma migrate dev
```

#### 5. Seed do banco

Após executar as migrations, rode o seed do banco de dados dentro do container da API:

```bash
docker compose -f docker-compose.dev.yml exec api npx prisma db seed
```

#### 6. Acessar a aplicação

Após finalizar todos os passos, a aplicação estará disponível em:

```
http://localhost:3000
```

#### 🟢 Health Check

Você pode verificar se a aplicação está rodando corretamente acessando:

http://localhost:3000/health

Essa rota retorna uma resposta simples indicando que o serviço está ativo:

```json
{
  "message": "Hello world"
}
```

## 🧪 Testes

> O projeto utiliza Jest para testes automatizados. Os testes utilizam um ambiente separado do desenvolvimento, incluindo um banco de dados exclusivo para testes.

### Fluxo para executar os testes

#### 1. Certifique-se de que os containers já estão rodando

```bash
docker compose ps
```

#### 2. Crie um arquivo `.env.test` baseado no exemplo abaixo:

```env
PORT=3000

DATABASE_URL="postgres://postgres:admin@localhost:5432/app_test"

TOKEN_SECRET=your_secret_here
TOKEN_EXPIRATION=10m

REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRATION=7d

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="adminPassword1234"
```

#### 3. Instale as depêndecias

```bash
npm install
```

#### 4. Gere o Prisma Client

```bash
npx prisma generate
```

#### 5. Execute os testes

```bash
npm run test
```

#### ✅ Resultado dos testes

Após executar os testes com sucesso, o Jest exibirá o seguinte output:

![Tests](./docs/tests-output.png)

#

<br>
<br>
<br>
<p align="center "><i>Obrigado por acessar o projeto =)</i></p>
