
const User = require('../models/user');

const createUser = async (userData) => {
  try {
    const user = await User.create(userData);

    return user;
  } catch (error) {
    console.log(error)
    throw error;
  }
};
const getUserByUsername = async (username) => {
    try {
      const user = await User.findOne({
        where: { username }
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (userId, updatedData) => {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        user.first_name =updatedData.first_name;
        user.last_name= updatedData.last_name;
        user.password=updatedData.password;
        user.account_updated= new Date();
        await user.save();
        return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };
  const getUserByToken = async (token) => {
    try {
      const user = await User.findOne({ where: { verificationToken: token } });
      return user;
    } catch (error) {
      throw error;
    }
  };

module.exports = { createUser,getUserByUsername, updateUser, getUserByToken};
