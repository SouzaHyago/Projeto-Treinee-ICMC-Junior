# Projeto Trainee ICMC Junior - Gerenciador de Tarefas

Um aplicativo web full-stack para gerenciamento de tarefas, construído com React (Vite) no frontend e Node.js (Express, MongoDB) no backend.

O sistema permite que os utilizadores se registem, façam login, e administrem as suas tarefas pessoais através de uma interface limpa e reativa.

## ✨ Funcionalidades Principais

* **Autenticação de Utilizador:** Sistema completo de registo e login de utilizador.
* **Gestão de Sessão:** Utilização de JSON Web Tokens (JWT) para autenticação e proteção de rotas.
* **CRUD de Tarefas:** Funcionalidade completa para Criar, Ler, Atualizar e Excluir tarefas.
* **Gestão de Perfil:** Os utilizadores podem ver e atualizar as suas informações de perfil, incluindo nome, CPF, data de nascimento e senha.
* **Exclusão de Conta:** Os utilizadores podem excluir as suas próprias contas (implementado como *soft delete* no backend).
* **Filtros de Tarefas:** O dashboard principal permite filtrar tarefas por "Todas", "Em andamento", "Atrasadas" e "Concluídas".
* **Vistas Dedicadas:** Páginas específicas para tarefas "Hoje", "Próximas" (7 dias), "Atrasadas" e "Concluídas".
* **Rotas Protegidas:** O frontend utiliza rotas públicas e privadas para garantir que apenas utilizadores autenticados possam aceder às páginas de tarefas.
* **Notificações:** Feedback ao utilizador através de *toasts* para ações como criação, edição e erros.

## 🛠️ Tecnologias Utilizadas

### Frontend

* **React.js**
* **Vite** (Bundler e Servidor de Desenvolvimento)
* **Tailwind CSS** (Estilização)
* **React Router DOM** (Roteamento)
* **Axios** (Cliente HTTP)
* **Lucide React** (Ícones)
* **React Toastify** (Notificações)
* **Framer Motion** (Animações)

### Backend

* **Node.js**
* **Express.js** (Framework do servidor)
* **MongoDB** (Banco de dados) com **Mongoose** (ODM)
* **jsonwebtoken (JWT)** (Autenticação)
* **bcrypt** (Hash de senhas)
* **cors** (Cross-Origin Resource Sharing)
* **dotenv** (Gestão de variáveis de ambiente)

## 🚀 Como Executar o Projeto

### Pré-requisitos

* **Node.js** (v18 ou superior)
* **npm** (ou yarn)
* **MongoDB** (uma instância local ou um cluster no MongoDB Atlas)

---

### 1. Configuração do Backend

1.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na raiz da pasta `backend` e adicione as seguintes variáveis:
    ```env
    # String de conexão do MongoDB
    DATABASE_URI=sua_string_de_conexao_mongodb_aqui

    # Segredo para assinar os tokens JWT (pode ser qualquer string segura)
    JWT_SECRET=seu_segredo_super_secreto_aqui

    # Porta para o backend. O frontend espera que seja 3001.
    PORT=3001
    ```

4.  Inicie o servidor de desenvolvimento (com hot-reload):
    ```bash
    npm run dev
    ```
    O servidor estará em execução em `http://localhost:3001` (ou na porta que você definiu).

---

### 2. Configuração do Frontend

1.  Em outro terminal, navegue até a pasta do frontend:
    ```bash
    cd frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie o servidor de desenvolvimento Vite:
    ```bash
    npm run dev
    ```
   

4.  Abra o seu navegador e aceda a `http://localhost:5173` (ou qualquer que seja o URL que o Vite indicar no terminal).

## 📂 Estrutura de Ficheiros (Simplificada)


/
+-- backend/
|   +-- controllers/    # Lógica de rotas (userController.js, taskController.js)
|   +-- models/         # Schemas do Mongoose (User.js, Task.js)
|   +-- routes/         # Definições de rotas (userRoutes.js, taskRoutes.js)
|   +-- services/       # Lógica de negócio (userService.js, taskService.js)
|   +-- .env            # (A criar) Variáveis de ambiente
|   +-- server.js       # Ponto de entrada do servidor Express
|   +-- package.json
|
+-- frontend/
    +-- src/
    |   +-- assets/     # Imagens e SVGs
    |   +-- components/ # Componentes reutilizáveis (FormLogin, Sidebar, Modal, etc.)
    |   +-- context/    # Contexto React (AuthContext.jsx)
    |   +-- modals/     # Componentes de modal específicos
    |   +-- pages/      # Componentes de página (Tarefas, Login, Cadastro, etc.)
    |   +-- routes/     # Componentes de roteamento (privateRoute.jsx)
    |   +-- api.js      # Configuração do cliente Axios
    |   +-- App.jsx     # Componente raiz da aplicação
    |   +-- main.jsx    # Ponto de entrada do React/Vite
    +-- tailwind.config.js
    +-- vite.config.js
    +-- package.json

## 🌐 Endpoints da API

### Rotas de Utilizador (`/users`)

* `POST /cadastro`: Regista um novo utilizador.
* `POST /login`: Autentica um utilizador e retorna um JWT.
* `GET /profile`: (Autenticado) Retorna o perfil do utilizador logado.
* `PUT /profile`: (Autenticado) Atualiza o perfil do utilizador logado.
* `PATCH /profile`: (Autenticado) Desativa (soft delete) a conta do utilizador logado.

### Rotas de Tarefas (`/tasks`)

*Todas as rotas de tarefas são protegidas e exigem autenticação.*

* `POST /`: Cria uma nova tarefa.
* `GET /`: Lista todas as tarefas do utilizador logado.
* `PUT /:id`: Atualiza uma tarefa específica pelo seu ID.
* `DELETE /:id`: Exclui uma tarefa específica pelo seu ID.
* `PATCH /complete/:id`: Marca uma tarefa específica como concluída.
