// index.js
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User');

const bcrypt = require('bcrypt'); 
const rateLimit = require('express-rate-limit');

  const loginLimiter = rateLimit({
    windowsMs: 15 * 60 * 1000, // tempo de espera caso exceda
    max: 3, // numero de tentaticvas
    message: "Muitas tentativas de login, tente novamente em 15 minutos"
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint de login (vulnerável a SQL Injection) bcrypt para criar um hash e comparar e limitacao de input ou bloqueio para evitar brute force
app.post('/login', loginLimiter ,async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });  // Falha ao procurar pelo user ou senha
  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Endpoint de listagem de usuários (expondo dados sensíveis)
app.get('/users', async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'username'] }); //pw exposto 
  res.json(users);
});

// Endpoint de detalhe do usuário logado (expondo senha)
app.get('/profile', async (req, res) => {
  const { username } = req.query;
    const user = await User.findOne({
      where: { username: username ?? null },
      attributes: ['id','username'] // sem o atributo ele expoe todos os dados
    }); 
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
