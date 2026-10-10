
# FlowBoard

Full-stack task management application developed
with React, Fastify and PostgreSQL.

## Project Goal

Explore AI-assisted software development using
GitHub Copilot throughout the development lifecycle.

## Tech Stack

- React
- Vite
- Node.js
- Fastify
- PostgreSQL
- GitHub Copilot

## Project Structure

- frontend/: React application
- backend/: REST API
- .github/: Copilot instructions

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Run Backend

```bash
cd backend
npm install
npm run dev
```

## Publicação

O frontend pode ser publicado na Vercel e o backend no Render, usando um banco
PostgreSQL do Neon. Configure as variáveis abaixo sem versionar arquivos `.env`:

### Vercel

- `VITE_API_URL`: URL pública do backend Render.
- `VITE_DEMO_READ_ONLY=true`: oculta as ações de criação, edição, exclusão e
  alteração de status na demonstração pública.
- Build command: `npm run build`.
- Output directory: `dist`.
- Root directory: `frontend`.

### Render

- `DATABASE_URL`: string de conexão do Neon.
- `PORT`: fornecida pelo Render; o backend usa essa porta automaticamente.
- `CORS_ORIGIN`: origens permitidas, por exemplo
  `https://flowboard.vercel.app`.
- `DEMO_READ_ONLY=true`: rejeita mutações no backend público, mesmo que uma
  requisição tente ignorar a interface.
- Start command: `npm start`.
- Root directory: `backend`.

Para desenvolvimento local, configure `CORS_ORIGIN=http://localhost:5173`.
Em produção, configure apenas a origem pública, por exemplo
`CORS_ORIGIN=https://flowboard.vercel.app`. Para permitir mais de uma origem,
separe os valores por vírgula. O backend aceita somente as origens listadas
explicitamente nessa variável. CORS não substitui autenticação, e
`DATABASE_URL` nunca deve ser configurada no frontend.

## Development Status

Phase 1: Initial project setup.
