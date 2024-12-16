//utils\genToken.js

const jwt = require('jsonwebtoken');

// Função para gerar um token JWT
function generateToken(payload, secretKey, options = {}) {
  // Configurações padrão para o token
  const defaultOptions = {
    expiresIn: '9999h', // Tempo de expiração do token
  };

  // Junta as configurações padrão com as opções passadas como parâmetro
  const finalOptions = { ...defaultOptions, ...options };

  // Gera o token
  const token = jwt.sign(payload, secretKey, finalOptions);
  console.log('Token JWT:', token);
  return token;
}

// Exemplo de uso da função
// const payload = { userId: 123, role: 'admin' }; // Dados que serão armazenados no token
// const secretKey = 'your_secret_key'; // Chave secreta para assinar o token

// const token = generateToken(payload, secretKey);


module.exports = generateToken;
