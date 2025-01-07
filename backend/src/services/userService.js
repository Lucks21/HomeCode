const User = require('../models/User');

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const getAllUsers = async () => {
  return await User.find();
};

module.exports = {
  createUser,
  getUserByEmail,
  getAllUsers,
};
