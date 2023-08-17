const { DataTypes, UUIDV4 } = require("sequelize");

const status = {
    pending:'Pending', acepted:'Acepted', inProcess:'InProcess', sended:'Sended', cancelled:'Cancelled'
}

module.exports =  (sequelizeInstance)=>{
    const Order = sequelizeInstance.define('Order',{
        id:{
            type:DataTypes.UUID,
            defaultValue:UUIDV4,
            primaryKey:true
        },
        products:{
            type:DataTypes.ARRAY(DataTypes.JSON),
            defaultValue:[]
        },
        status:{ 
            type:DataTypes.ENUM(status.acepted,
                 status.pending, 
                 status.inProcess, 
                 status.sended, 
                 status.cancelled), 
            defaultValue:status.pending
        }
    })
    Order.associate = models =>{
        Order.belongsTo(models.User, { foreignKey: 'userId' })
        Order.belongsToMany(models.Product, { through: 'order-Products' })
    }

    return Order
}