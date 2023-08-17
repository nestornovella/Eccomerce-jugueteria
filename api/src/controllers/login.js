const { User } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { rejectHelper, responseHelper } = require("../helpers/response");

const messages = {
  errors: {
    paramsRequire: "need password and email to login",
    incorrectParams: "wrong password or email",
  },
  status: {
    allowedToken: "allowed token",
  },
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
            {id:user.id, email: user.email},
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: process.env.EXPIRES_IN }
          );
          responseHelper(res, user, ['Authorization', token], 200)
        }
      } else rejectHelper(messages.errors.incorrectParams);
    } catch (error) {
      next(error);
    }
  },
  verifyToken: async (req, res, next) => {
    const { token } = req.body;
    try {
      const verify = await jwt.verify(token, process.env.TOKEN_SECRET_KEY);


      responseHelper(res, messages.status.allowedToken, ['user', JSON.stringify(verify.id)]);
    } catch (error) {
      if (error.name === 'TokenExpiredError')next("expired token")
      else if (error.name === 'JsonWebTokenError')next("invalid token")
      else next(error);
    }
  },
};
