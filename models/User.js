// models/User.js
const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const bcrypt = require('bcrypt');

const User = sequelize.define('user', { //define usernae e pw como string simples,para username nao confere se ja tem igual e permite campo nulo
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    set(value){ // passa o valor de password para hash e coloca alguima regras pra senha
        if(value.length <9){
          throw new Error('A senha tem de ter pelo menos 8 caracteres');
        }
        if(!/\d/.test(value)){
          throw new Error('A senha tem de ter pelo menos um numero');
        }
        if(!/[a-z]/.test(value)){
          throw new Error('A senha tem de ter pelo menos uma letra minuscula');
        }
        if(!/[!@#$%^&*]/.test(value)){
          throw new Error('A senha tem de ter pelo menos um caracter especial');
        }
      const hash = bcrypt.hashSync(value,10);
      this.setDataValue('password', hash);
    },
    allowNull: false
  },
});

module.exports = User;
