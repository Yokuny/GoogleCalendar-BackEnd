# Google Calendar Integration API

Uma API RESTful para integração entre um sistema de agendamento local e o Google Calendar.

## Funcionalidades

- Autenticação de usuários (signup, signin e atualização de dados)
- Gerenciamento de agendamentos com calendarios mensal, semanal e diário
- Sincronização automática com o Google Calendar
- Autenticação OAuth 2.0 com Google
- Integração bidirecional entre o sistema e Google Calendar

## Tecnologias

- Node.js
- Express
- MongoDB
- Google Calendar API
- JWT para autenticação

## Instalação

```bash
npm install
npm run dev
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=3000
MONGODB_URI=sua_string_de_conexao_mongodb
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI_LOCAL=http://localhost:3000/auth/google/callback
JWT_SECRET=sua_chave_secreta
```

## Rotas da API

### Usuários

- `POST /user/signup` - Cadastro de usuário
- `POST /user/signin` - Login de usuário
- `PUT /user/update` - Atualização de dados do usuário (requer autenticação)
- `POST /user/google/token` - Configurar token de acesso do Google (requer autenticação)
- `GET /user/google/access_token` - Obter token de acesso do Google (requer autenticação)

### Agendamentos

- `GET /schedule` - Listar todos os agendamentos do usuário (requer autenticação)
- `GET /schedule/:id` - Obter agendamento específico (requer autenticação)
- `POST /schedule` - Criar um novo agendamento (requer autenticação)
- `PUT /schedule/:id` - Atualizar um agendamento (requer autenticação)
- `DELETE /schedule/:id` - Excluir um agendamento (requer autenticação)

## Fluxo de Integração com Google Calendar

1. Usuário se autentica no sistema
2. Usuário autoriza acesso ao Google Calendar via OAuth
3. Sistema armazena tokens de acesso e atualização
4. Quando um agendamento é criado/atualizado/excluído localmente:
   - A operação é replicada automaticamente no Google Calendar
   - O ID do evento no Google Calendar é armazenado junto ao agendamento local
5. O sistema atualiza automaticamente tokens expirados usando o refresh token
