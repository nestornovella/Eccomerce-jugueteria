require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const db = {}
const options = { native: false, dialect: "postgres", logging: false };

const sequelize = new Sequelize(process.env.SEQUELIZE_URI, options);

//get All models
const modelsPath = (model = "") => path.join(__dirname, "models", model);
const file = fs.readdirSync(modelsPath());
file
  .filter((dir) => dir.indexOf(".") != 0 && dir.slice(-3) === ".js")
  .forEach(
    (e) =>{
      const modelName = e.replace(".js", "");
      const model = typeof require(modelsPath(e)) === "function" &&
      require(modelsPath(e))(sequelize)
      db[modelName] = model
    }
    
     
  );
//Asociations

// Establecer las relaciones
Object.keys(sequelize.models).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  } 
});



console.log(sequelize.models);
console.log(db)
module.exports = {
  ...sequelize.models,
  connect: sequelize,
  db
};
