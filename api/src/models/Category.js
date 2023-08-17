const {DataTypes, UUIDV4} = require('sequelize')


module.exports = (sequelizeInstance) =>{
   const Category =  sequelizeInstance.define('Category', {
        id:{
            type: DataTypes.UUID,
            primaryKey:true,
            defaultValue:UUIDV4
        },
        name:{
            type:DataTypes.STRING,
            alloowNull:false  
        }
    },{timestamps:false})

    Category.associate = models => {
        Category.belongsToMany(models.Product, { through: 'product-category' })
    }

    return Category
}