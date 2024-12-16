const express = require("express"); // Importa o framework Express para criar o servidor
const path = require("path"); // Módulo para manipulação de caminhos de arquivos
const cookieParser = require("cookie-parser"); // Middleware para lidar com cookies
const logger = require("morgan"); // Middleware para registrar logs das requisições
const expressLayouts = require("express-ejs-layouts"); // Middleware para gerenciar layouts de páginas no EJS
const config = require("./config"); // Importa as configurações locais de um arquivo
const screens = require("./config/screens"); // Importa a configuração das telas do arquivo de configuração
const mqttClient = require('./services/mqttservice');


const generateToken = require("./utils/genToken"); // Função para gerar um token
var compression = require("compression"); // Middleware para compactação de resposta HTTP

const { listRoutes, getapi } = require("./utils/myFunctions"); // Funções utilitárias para listar rotas e fazer chamadas à API

const indexRoutes = require("./routes/indexRoutes"); // Importa as rotas principais (index)
const baseRoutes = require("./routes/baseRoutes"); // Importa as rotas base (gerenciar fábricas, equipamentos, etc)
const oeeRoutes = require("./routes/oeeRoutes"); // Importa as rotas para dados de OEE (Overall Equipment Effectiveness)

// Importa os modelos definidos no diretório 'models' para interagir com o banco de dados
const { sequelize } = require("./models"); // Importa o objeto sequelize do arquivo models/index.js

// Coloriza as saídas no console para tornar a leitura mais fácil
const colors = require("colors");

var app = express(); // Cria uma instância do servidor Express

// Gerar um token para consumo da API local com dados de usuário fictício
const payload = { userId: 0, role: "fts" }; // Dados que serão armazenados no token
const secretKey = config.key; // Chave secreta para assinar o token
console.log(secretKey); // Exibe a chave secreta no console
app.locals.token = generateToken(payload, secretKey); // Cria e armazena o token gerado em `app.locals`

// Configuração do motor de visualização (view engine) para EJS
app.set("views", path.join(__dirname, "views")); // Define o diretório onde estão as views (páginas HTML geradas com EJS)
app.set("view engine", "ejs"); // Define o EJS como o motor de template para renderização
app.use(expressLayouts); // Habilita o uso de layouts EJS
app.set("layout", "index"); // Define o layout padrão (index.ejs) para as páginas renderizadas

// Middleware para definir a variável `screens` dinamicamente para todas as views
app.use((req, res, next) => {
  const equipmentId = req.params.equipmentid || 1; // Tenta pegar o ID do equipamento da URL, senão define um valor padrão (1)

  // Atualiza `res.locals.screens` com as rotas dinamicamente alteradas
  res.locals.screens = screens.map((screen) => {
    return {
      ...screen, // Mantém todos os dados originais da tela
      href: screen.href.replace(":equipmentid", equipmentId), // Substitui o parâmetro :equipmentid pela ID do equipamento
    };
  });
  res.locals.states = mqttClient.getCollectedData();

  next(); // Passa para o próximo middleware ou rota
});

// Middlewares padrão
app.use(logger("dev")); // Log de requisições HTTP (dev: formato compacto)
app.use(express.json()); // Middleware para interpretar o corpo das requisições como JSON
app.use(express.urlencoded({ extended: false })); // Middleware para interpretar dados de formulários (URL encoded)
app.use(cookieParser()); // Middleware para parsear cookies nas requisições
app.use(express.static(path.join(__dirname, "public"))); // Middleware para servir arquivos estáticos (como imagens, CSS e JS)

// Habilita compressão de respostas HTTP para otimizar o envio de dados
app.use(compression());

// Configuração das rotas da aplicação
app.use("/", indexRoutes); // Roteia para as rotas do index
app.use("/api", baseRoutes); // Roteia para as rotas base (API)
app.use("/oee", oeeRoutes); // Roteia para as rotas de dados de OEE (eficiência do equipamento)

// Middleware para capturar requisições para URLs não encontradas (erro 404)
app.use((req, res, next) => {
  res.status(404).render("error", { // Renderiza uma página de erro 404 se a URL não for encontrada
    layout: false, // Não usa o layout, apenas a página de erro
    title: "404 - Página Não Encontrada", // Título da página de erro
    message: "Página Não Encontrada", // Mensagem de erro
    error: {
      status: 404, // Código de status HTTP
      stack: "", // Pilha de erros (em produção geralmente estará vazia)
    },
  });
});

// Middleware para tratar erros globais na aplicação
app.use(function (err, req, res, next) {
  res.locals.message = err.message; // Mensagem de erro
  res.locals.error = req.app.get("env") === "development" ? err : {}; // Detalhes do erro, mas só em ambiente de desenvolvimento

  res.status(err.status || 500); // Define o código de status da resposta
  res.render("error"); // Renderiza a página de erro
});

// Sincroniza os modelos Sequelize com o banco de dados
sequelize
  .sync({ alter: false }) // Sincroniza as tabelas, sem alterá-las se já existirem
  .then(() => {
    console.log("Tabelas sincronizadas com sucesso.".green); // Exibe mensagem no console se a sincronização for bem-sucedida
  })
  .catch((err) => {
    console.error("Erro ao sincronizar tabelas:".red, err); // Exibe mensagem de erro caso haja falha na sincronização
  });

  mqttClient.connectMqtt();

// Exemplo de como as rotas e dados podem ser manipulados com a API, se necessário
module.exports = app; // Exporta o aplicativo para ser utilizado em outros arquivos (geralmente em um arquivo como `bin/www`)

// SEED DATA (exemplo de inserção de dados no banco)////////////////////////////////////////////////////////////////////////

// Exemplo de criação de dados para os modelos definidos no banco
// User.create({name:"Eduardo", email:"ecfortes@gmail.com", password:"123", FactoryId: 1}); // Criação de usuário
// Equipment.create({name: "Misturador1", ProductionLineId: 1, CategoryEquipmentId: 1}); // Criação de equipamentos

////////////////////////EXEMPLOS DE USO///////////////////////////////////////////////////////////////////////

// Exemplo de uso do serviço MQTT (comentar ou descomentar conforme necessidade)
// mqttService.subscribeToTopic('golden/tanks'); // Inscrição para um tópico MQTT

// Função assíncrona que pode ser usada para acessar a API e manipular dados
// async function fetchData() {
//   try {
//     const data = await getapi('factory', app.locals.token); // Obtém dados de fábrica usando a API
//     console.log(data); // Manipula e exibe os dados recebidos
//   } catch (error) {
//     console.error('Erro ao acessar a API:', error); // Exibe erro em caso de falha
//   }
// }
// fetchData(); // Chama a função de obtenção de dados da API

// Exemplo de como buscar todas as fábricas do banco usando Sequelize
// async function FindAllFabricas() {
//   try {
//     const usuarios = await User.findAll({
//       include: [
//         { model: Factory, attributes: ['name'] }
//       ]
//     });
//     console.log('All factories:', JSON.stringify(usuarios,null,2)); // Exibe as fábricas no console
//   } catch (error) {
//     console.error('Error fetching data:', error); // Lida com erros ao buscar dados
//   }
// }

// FindAllFabricas(); // Chama a função
