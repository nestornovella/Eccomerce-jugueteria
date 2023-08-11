const { User, Order} = require("../db.js");
const bcrypt = require('bcrypt')
const { responseHelper, rejectHelper } = require("../helpers/response.js");
const messages = {
  errors: {
    paramsRequired: "params required",
    emailExist: "email all ready exist",
    notUpdated: "the user cant be updated",
    codeRequire:"the code is required",
    badCode: "the code is not a validate code",
    hashError: "somethin its wrong the hash cant be created"
  },
  status: {
    noUsers: "users not founded",
    noUser: "user not founded",
    updated: "user updated",
    deleted: "the user be deleted"
  },
};

module.exports = {
  getUsers: async (req, res, next) => {
    const { id, email } = req.query;
    try {
      if (id) {
        const user = await User.findOne({ where: { id: id } });
        user ? responseHelper(res, user) : rejectHelper(messages.status.noUser);
      } else if (email) {
        const user = await User.findOne({ where: { email: email } });
        user ? responseHelper(res, user) : rejectHelper(messages.status.noUser);
      } else {
        const usersList = await User.findAll({include:{model: Order}});
        if (!usersList.length) {
          responseHelper(res, messages.status.noUsers);
        } else {
          responseHelper(res, usersList);
        }
      }
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req, res, next) => {
    const { email, name, password } = req.body;
    try {
      if ((!email, !name, !password))rejectHelper(messages.errors.paramsRequired);
      const encrypedPassword = await bcrypt.hash(password, 5)
      const emailVerify = await User.findAll({ where: { email: email } });
      if (emailVerify.length) rejectHelper(messages.errors.emailExist);
      else {
        const newUser = await User.create({...req.body, password:encrypedPassword});
        responseHelper(res, newUser);
      }
    } catch (error) {
      next(error);
    }
  },

  putUser: async (req, res, next) => {
    const { id, isAdmin } = req.body;
    const {code} = req.headers

    try {
      if(isAdmin){
        if(!code)rejectHelper(messages.errors.codeRequire)
        else{
          if(code !== process.env.CODE)rejectHelper(messages.errors.badCode)
        }
      }
      const userUpdated = await User.update(req.body, { where: { id: id } });
      if (userUpdated[0] === 0) rejectHelper(messages.errors.notUpdated);
      else {
        responseHelper(res, messages.status.updated);
      }
      res.json(userUpdated);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    const { id } = req.params;

    try {
      if (!id) rejectHelper(messages.errors.paramsRequired);
      else {
        const deleted = await User.destroy({where:{id:id}})
        if(deleted === 0)rejectHelper(messages.status.noUser)
        res.json(messages.status.deleted)
      }
    } catch (error) {
      next(error)
    }
  },
};
