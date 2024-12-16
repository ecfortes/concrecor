// Importa a biblioteca jsonwebtoken para manipular tokens JWT
const jwt = require('jsonwebtoken');

// Importa a configuração, presumivelmente contendo a chave secreta usada para verificar tokens
const config = require('../config');

// Middleware de autenticação
const authenticate = (req, res, next) => {
  // Obtém o token de autenticação do cabeçalho da requisição
  const token = req.headers['authorization'] ;

  // Verifica se o token foi fornecido
  if (!token) {
    // Se o token não for fornecido, responde com status 401 (não autorizado) e uma mensagem de erro
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Tenta verificar o token utilizando a chave secreta armazenada em config.key
    const decoded = jwt.verify(token, config.key);

    // Se o token for válido, adiciona os dados decodificados à requisição (req.user) para uso posterior
    req.user = decoded;
    //console.log(req.user)
    // Chama o próximo middleware na pilha
    next();
  } catch (err) {
    // Se o token for inválido, responde com status 401 (não autorizado) e uma mensagem de erro
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Exporta o middleware de autenticação para que possa ser usado em outras partes do aplicativo
module.exports = authenticate;
