const { DataTypes, UUIDV4, INTEGER } = require("sequelize");

module.exports = (sequelizeInstance) => {
  const Product = sequelizeInstance.define("Product", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    stock: {
      type: INTEGER,
      defaultValue: 1,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    width: {
      type: DataTypes.FLOAT,
    },
    height: {
      type: DataTypes.FLOAT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
  });

  Product.associate = (models) => {
    Product.belongsToMany(models.Category, { through: "product-category" });
    Product.belongsToMany(models.Order, { through: "order-Products" });
  };
  return Product;
};
