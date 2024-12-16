// routeLoggerMiddleware.js

//Função do middleware que loga as rotas acessadas
const routeLoggerMiddleware = (req, res, next) => {
  console.log(`Rota acessada: ${req.method} ${req.originalUrl} - IP: ${req.ip}`.white);
  console.log(req.headers['user-agent']); // Exibe o user-agent do navegador 
  next(); // Chama o próximo middleware na cadeia
};

module.exports = routeLoggerMiddleware;
