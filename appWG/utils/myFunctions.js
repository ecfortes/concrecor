// middleware/myfunctions.js

const listRoutes = (app) => {
  app._router.stack.forEach((middleware) => {
    if (middleware.route) { // Rota única
      console.log(`${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') { // Router configurado
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).map(method => method.toUpperCase()).join(', ');
          console.log(`${methods} ${handler.route.path}`);
        }
      });
    }
  });
};

async function getapi(api,token) {
  try {
    const response = await fetch(`http://localhost:3000/api/${api}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        // Outros headers conforme necessário
      },
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao acessar a API:', error);
    throw error; // Lançar o erro para que seja tratado onde a função getapi foi chamada
  }
}

module.exports = { listRoutes, getapi };
