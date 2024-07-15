# CLI Architecture API

Proposta de estrutura, padronização e configuração arquitetural para desenvolvimento de projetos de testes automatizados de API.

## Detalhamento da arquitetura

### Tecnologias

- **allure-mocha**: Integração com ferramenta de gerenciamento de casos de testes [Allure TestOps](https://qameta.io/).
- **chai**: Asserção de testes em formato de BDD / TDD.
- **dotenv**: Gerenciamento de variáveis de ambiente.
- **eslint**: Verificador de padrões de escrita da linguagem JavaScript.
- **faker-js/:faker**: Geração de dados fake ("falsos" mas em padrões válidos).
- **joi**: Validação de schema de dados.
- **mocha**: Estrutura para escrita de testes (ex.: describe, it) e runner da automação.
- **mochawesome**: Gerador de relatórios para automações em estruturas Mocha.
- **mongodb**: Conexão e execução de operações em bancos não-relacionais MongoDB.
- **mysql2**: Conexão e execução de operações em bancos relacionais MySQL.
- **prettier**: Formatador de código opinativo
- **supertest**: Abstração de alto nível para realizar testes HTTP.

### Diretórios

- 📂  **nome-serviço-api-test/**:
  - 📂 **core/:** Contém o centro da automação de testes de API, ou seja, as rotas que serão testadas e os testes em si.
    - 📂 **routes/:** Contém as estruturas para chamada das rotas a serem testadas.
    - 📂 **tests/:** Contém as suítes/:cenários de testes por rotas.
  - 📂 **support/:** Contém o apoio necessário e complementar para execução de um teste, como massa de dados, funções de suporte para preparação do ambiente de teste, geração de relatórios...
    - 📂 **data/:** Contém os requests e responses bodies a serem utilizados na chamada da API e validação do retorno dos testes.
      - 📂 **request/:** Contém as estruturas de requests bodies.
      - 📂 **response/:** Contém as estruturas de responses bodies.
        - 📂 **schema/:** Contém os schemas dos responses bodies com retornos de dados dinâmicos.
      - 📂 **database/:** Contém as estruturas de conexão, operações e queries de banco de dados
        - 📂 **mongodb/:** [SOMENTE EM PROJETOS QUE FAZEM CONEXÃO COM O MONGODB]
          - 📄 **connection.js:** Funções referentes a abertura e fechamento de conexão com banco de dados não relacional MongoDB.
          - 📄 **operations.js:** Funções com operações de documentos MongoDB.
          - 📄 **queries.js:** Função com construção de queries do MongoDB.
        - 📂 **mysql/:** [SOMENTE EM PROJETOS QUE FAZEM CONEXÃO COM O MYSQL]
          - 📄 **connection.js:** Funções referentes a abertura e fechamento de conexão com banco de dados relacional MySQL.
          - 📄 **queries.js:** Função com construção de queries do MySQL.
      - 📂 **env/:** Contém estruturas referentes ao gerenciamento de variáveis de ambiente da aplicação.
        - 📄 **config-environment.js:** Funções referentes a validação e definição de uso de envs.
      - 📂 **helpers/:** Contém pré e pós condições das estrutura de execução dos testes.
        - 📄 **allure-authors.js:** Lista de nome de QAs passíveis a serem autores de um conjunto de testes.
        - 📄 **commons.js:** Ações de negócio em comum a serem realizada antes/:pós a execução de mais de um teste.
        - 📄 **config.js:** Estruturas de dados a serem utilizadas como configurações fixas nos testes.
        - 📄 **report.js:** Ações atreladas a geração de report de execução de teste.
        - 📄 **utils:** Possui funções utilitárias que auxiliam na construção e execução dos testes.
  - 📄 **.env:** Contém as variáveis de ambiente.
  - 📄 **.env.example:** Contém o modelo de declaração das variáveis de ambiente.
  - 📄 **.eslintignore:** Contém a definição de pastas e arquivos que devem ter a verificação do eslint ignorada.
  - 📄 **.eslintrc:** Contém as definições de configuração do eslint.
  - 📄 **.gitignore:** Contém a definição de pastas e arquivos que não devem subir para o repositório do projeto no gitlab.
  - 📄 **.gitlab-ci.yml:** Contém as definições e configurações da pipeline CI/:CD do gitlab.
  - 📄 **.mocharc.json:** Contém as definições de configuração do mocha.
  - 📄 **.npmrc:** Contém as definições de configuração do npm.
  - 📄 **.README.md:** Contém a apresentação e informações sobre o projeto.
  - 📄 **.package.json:** Contém as definições do projeto de automação.
  - 📄 **.prettier.config.cjs:** Contém as definições de configuração do prettier.

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

### Criar projeto

Para construir um novo projeto baseado na arquitetura proposta execute o seguinte comando no terminal e responda as perguntas para criar a arquitetura baseada nas necessidades do projeto.

```bash
architecture-test-api create
```

### Adicionar estrutura de integração com banco de dados relacional (MySQL)

Para adicionar somente a estrutura de integração com um banco de dados relacional (MySQL) em um projeto existente. 

```bash
architecture-test-api mysql
```

### Adicionar estrutura de integração com banco de dados não-relacional (MongoDB)

Para adicionar somente a estrutura de integração com um banco de dados não-relacional (MongoDB) em um projeto existente. 

```bash
architecture-test-api mongodb
```

### Adicionar estrutura de integração com ferramenta de gerenciamento de casos de testes (Allure TestOps)

Para adicionar somente a estrutura de integração com a ferramenta de gerenciamento de casos de testes (Allure TestOps) em um projeto existente. 

```bash
architecture-test-api allure-testops
```

### Adicionar estrutura de integração com ferramenta de comunicação (Slack)

Para adicionar somente a estrutura de integração com a ferramenta de comunicação (Slack) em um projeto existente. 

```bash
architecture-test-api slack
```

## Changelog

Consulte o [CHANGELOG](./CHANGELOG.md) para obter mais informações sobre o histórico de alterações do projeto.