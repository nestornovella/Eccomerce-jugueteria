const { User } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { rejectHelper, responseHelper } = require("../helpers/response");

const messages = {
  errors: {
    paramsRequire: "need password and email to login",
    incorrectParams: "wrong password or email",
  },
  status:{
    allowedToken:"jwt current"
  }
};

module.exports = {
  createToken: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) rejectHelper(messages.errors.paramsRequire);
      const user = await User.findOne({ where: { email: email } });
      if (user) {
        const verifyPass = await bcrypt.compare(password, user.password);
        console.log(verifyPass);
        if (verifyPass) {
          const token = await jwt.sign(
            { email: user.email, password: user.password },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: process.env.EXPIRES_IN }
          );
          responseHelper(res,token)
        }
      } else rejectHelper(messages.errors.incorrectParams);
    } catch (error) {
      next(error);
    }
  },
  verifyToken:async (req, res, next)=>{
    const {token} = req.body
    try {

      const verify =await jwt.verify(token, process.env.TOKEN_SECRET_KEY)
      responseHelper(res, messages.status.allowedToken)
    } catch (error) {
      next(error)
    }
  }
};
