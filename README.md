# Google Calendar Integration API

Uma API RESTful para integração entre um sistema de agendamento local e o Google Calendar.

## Funcionalidades

- Autenticação de usuários (signup, signin e atualização de dados)
- Gerenciamento de eventos no banco de dados local
- Sincronização automática com o Google Calendar
- Autenticação OAuth 2.0 com Google
- Notificações de eventos

## Tecnologias

- Node.js
- Express
- MongoDB/Mongoose
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
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
```

## Rotas da API

### Autenticação
- `POST /auth/signup` - Cadastro de usuário
- `POST /auth/signin` - Login de usuário
- `PUT /auth/update` - Atualização de dados do usuário (requer autenticação)
- `GET /auth/google` - Iniciar autenticação Google OAuth
- `GET /auth/google/callback` - Callback para autenticação Google OAuth

### Eventos
- `GET /events` - Listar todos os eventos
- `POST /events` - Criar um novo evento
- `PUT /events/:id` - Atualizar um evento
- `DELETE /events/:id` - Excluir um evento

### Google Calendar
- `GET /calendar/sync` - Sincronizar eventos com Google Calendar
- `GET /calendar/list` - Listar eventos do Google Calendar
- `POST /calendar/add` - Adicionar evento ao Google Calendar