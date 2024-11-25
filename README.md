Aqui está o conteúdo formatado no estilo de um README.md:

# **CLI Architecture API**

Proposta de estrutura arquitetural padronizada para desenvolvimento de projetos de testes automatizados de APIs por frete.com

---

## **Arquitetura**

### **Tecnologias Utilizadas**

- **[Allure-Mocha](https://qameta.io/):** Integração com a ferramenta Allure TestOps para gerenciamento de casos de teste e relatórios avançados.
- **Chai:** Framework para assertivas em testes nos formatos BDD/TDD.
- **Dotenv:** Gerenciamento de variáveis de ambiente de forma segura.
- **ESLint:** Ferramenta para padronização e validação de código JavaScript.
- **Faker.js:** Geração de dados simulados com padrões válidos.
- **Joi:** Validação de esquemas de dados.
- **Mocha:** Framework de testes para escrita (ex.: `describe`, `it`) e execução de cenários.
- **Mochawesome:** Gerador de relatórios visualmente ricos para testes baseados no Mocha.
- **MongoDB:** Suporte para conexões e operações em bancos NoSQL.
- **MySQL2:** Suporte para conexões e operações em bancos relacionais MySQL.
- **Prettier:** Ferramenta opinativa para formatação consistente do código.
- **Supertest:** Abstração de alto nível para testes HTTP.

---

### **Estrutura de Diretórios**

```plaintext
📂 nome-servico-api-test/
├── 📂 core/
│   ├── 📂 routes/          # Chamadas de rotas da API
│   └── 📂 tests/           # Suítes e cenários de teste por rota
├── 📂 support/
│   ├── 📂 data/
│   │   ├── 📂 request/     # Requests bodies
│   │   ├── 📂 response/    # Responses bodies
│   │   │   └── 📂 schema/  # Validações de responses dinâmicos
│   │   └── 📂 database/    # Conexões e queries de banco
│   │       ├── 📂 mongodb/ # Conexões e operações MongoDB
│   │       └── 📂 mysql/   # Conexões e operações MySQL
│   ├── 📂 env/             # Gerenciamento de variáveis de ambiente
│   └── 📂 helpers/         # Funções utilitárias e configurações fixas
├── 📄 .env                 # Variáveis de ambiente
├── 📄 .env.example         # Exemplo de configuração de variáveis
├── 📄 .eslintignore        # Configurações ignoradas pelo ESLint
├── 📄 .eslintrc            # Configuração do ESLint
├── 📄 .gitignore           # Configuração de exclusão do Git
├── 📄 .gitlab-ci.yml       # Configuração de pipelines CI/CD
├── 📄 .mocharc.json        # Configuração do Mocha
├── 📄 package.json         # Metadados e dependências do projeto
├── 📄 prettier.config.cjs  # Configuração do Prettier
└── 📄 README.md            # Documentação do projeto
````




## Instalação

### Pré-requisitos

- **Node**
- **NPM**

### Instalar

```bash
npm i -g @frete.com/architecture-test-api
```

## Comandos


>
> 🗣️ Para uma maior detalhamento dos fluxos de execução de cada um dos comandos abaixo acesse o [diagrama](https://excalidraw.com/#json=0F2tXkUGNU_ZV97ZvYPiD,g-3nipxxUK3Arn-yNhPxyw)

### Criar um Novo Projeto

Para inicializar um projeto com a arquitetura proposta, crie uma pasta vazia e execute:

```bash
architecture-test-api create
```
Responda às perguntas interativas para configurar o projeto.

## Opcional: Adicionar Integrações em um projeto existente

### Banco de Dados Relacional (MySQL)

```bash
architecture-test-api mysql
```

### Banco de Dados Não-Relacional (MongoDB)

```bash
architecture-test-api mongodb
```

### Ferramenta de gerenciamento de casos de testes (Allure TestOps)

```bash
architecture-test-api allure-testops
```

### Slack

```bash
architecture-test-api slack
```

## Changelog

Consulte o [CHANGELOG](./CHANGELOG.md) para obter mais informações sobre o histórico de alterações do projeto.

