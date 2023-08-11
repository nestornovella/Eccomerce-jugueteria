const { DataTypes } = require("sequelize");

module.exports = (sequelizeInstance) => {
    const User = sequelizeInstance.define('User', {
        id:{
            type:DataTypes.UUID,
            allowNull:false,
            primaryKey:true,
            defaultValue:DataTypes.UUIDV4
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        zipCode:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        phoneNumber:{
            type:DataTypes.STRING,
            allowNull:false
        },
        address:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        wholesaler:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        banned:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        isAdmin:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        verifyed:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
        
    })
    User.associate = models => {
        User.hasMany(models.Order, { foreignKey: 'userId' }); 
      };
      return User
};
