# 🌥️ Nubo Panel

**Nubo Panel** é um painel administrativo e operacional moderno, desenvolvido com **React 19 + Vite**, que se conecta a um backend externo para:

- Executar comandos em tempo real via terminal web
- Monitorar containers Docker e recursos da máquina
- Orquestrar processos de deploy

---

## 🚀 Tecnologias Utilizadas

- [React 19](https://react.dev/)
- [Vite 7](https://vitejs.dev/)
- [Socket.IO](https://socket.io/) – comunicação WebSocket com backend
- [Xterm.js](https://xtermjs.org/) – terminal web interativo
- [Axios](https://axios-http.com/) – API REST
- [TypeScript](https://www.typescriptlang.org/)
- [Docker SDK/API](https://docs.docker.com/engine/api/) (no backend)

---

## 🧠 Visão Geral das Funcionalidades


### 🖥️ Terminal Web Interativo
- Execução de comandos shell via WebSocket
- Terminal nativo no navegador com Xterm.js
- Suporte a múltiplas sessões simultâneas

### 📊 Observabilidade de Infraestrutura
- CPU, RAM, disco, temperatura (se suportado)
- Detecção de carga e uso por processo
- Dashboard de status do sistema

### 🐳 Monitoramento de Containers Docker
- Listagem de containers ativos/parados
- Logs em tempo real por container
- Ações: start/stop/restart/redeploy

### 🚀 Deploy Automatizado
- Execução de pipelines locais
- Deploy remoto via SSH/API
- Logs e status de execução
- Agendamento e histórico

---

## 📦 Instalação

```bash
git clone https://github.com/devdinho/nubopanel.git
cd nubo-panel
yarn install
````

---

## 🧪 Ambiente de Desenvolvimento

```bash
npm run dev
```

Abra:
➡️ `http://localhost:5173`

---

## 🔌 Comunicação com Backends
### 1. Terminal Web (WebSocket)

```ts
const socket = io('http://localhost:3000/terminal', {
  path: '/terminal/socket.io',
  auth: { token: 'seu_token_jwt' }
});
```

### 2. API REST (Sistema de Observabilidade)

```ts
const api = axios.create({
  baseURL: 'https://vm.a6n.tech', // exemplo
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```
---

## 🔐 Segurança

* Tokens JWT validados no backend
* Sessões com expiração
* Requisições protegidas com headers `Authorization`
* (Planejado) Autenticação por OAuth/SAML para ambientes corporativos

---

## ✨ Roadmap

* [x] Terminal web funcional via socket
* [ ] Integração com sistema de recursos
* [ ] Autenticação JWT
* [ ] Painel de observabilidade do sistema
* [ ] Monitoramento e controle de containers Docker
* [ ] Orquestração de deploy com histórico e rollback
* [ ] Modo escuro e responsivo
* [ ] Logs centralizados por ambiente

---

## 👤 Autor

Anderson Freitas
[GitHub](https://github.com/devdinho)
[LinkedIn](https://linkedin.com/in/freitas-anderson/)

---

## 📄 Licença

MIT
