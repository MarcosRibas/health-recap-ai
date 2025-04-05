# Health Recap AI

Projeto de acompanhamento de saúde utilizando HTML, CSS, Tailwind e SQLite.

## Requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/health-recap-ai.git
cd health-recap-ai
```

2. Instale as dependências:
```bash
npm install
```

## Como executar

1. Para desenvolvimento:
```bash
npm run dev
```

2. Para iniciar o servidor:
```bash
node src/server.js
```

O projeto estará disponível em:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Estrutura do Projeto

- `src/` - Diretório principal do código fonte
  - `index.html` - Página principal
  - `style.css` - Estilos CSS com Tailwind
  - `server.js` - Servidor Express e configuração do SQLite
- `health.db` - Banco de dados SQLite (criado automaticamente)