// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    readOnly: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Email address already in use'
    },
    validate: {
      isEmail: {
        args: true,
        msg: 'Invalid email address'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    writeOnly: true,
    set(value) {
      if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)){
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(value, saltRounds);
      this.setDataValue('password', hashedPassword);
      }
      else {
        throw new Error('Your password should be between 8-20 characters!');
      }
    },
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'First name is required'
      },
      is: {
        args: /^[A-Za-z]+$/,
        msg: 'First name can only contain alphabetic characters'
      },
      len: {
        args: [2, 50],
        msg: 'First name must be between 2 and 50 characters'
      }
    }
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Last name is required'
      },
      is: {
        args: /^[A-Za-z]+$/,
        msg: 'Last name can only contain alphabetic characters'
      },
      len: {
        args: [2, 50],
        msg: 'Last name must be between 2 and 50 characters'
      }
    }
  },
 
}, 
{
  updatedAt: 'account_updated',
  createdAt: 'account_created'
},

{
  
  
});




module.exports = User;
