const { Order, User, Product } = require("../db");
const { responseHelper, rejectHelper } = require("../helpers/response");

const messages = {
  errors: {
    notOrder: "order not founded",
    paramsRequired: "params are required",
  },
  status: {
    deleteOrder: "the order was deleted",
    updateOrder: "the order was updated",
  },
};

module.exports = {
  getOrder: async (req, res, next) => {
    const { id, userId, extend } = req.query;
    try {
      if (id) {
        const orders = await Order.findByPk(id,{

          include: { model: Product },
        });
        orders
          ? responseHelper(res, orders)
          : rejectHelper(messages.errors.notOrder);
      }
      else if (userId) {
        const orders = await Order.findAll({ where: { userId: userId } });
        orders
          ? responseHelper(res, orders)
          : rejectHelper(messages.errors.notOrder);
      }else{
      const orderList =
        extend === "true"
          ? await Order.findAll({ include: { model: Product } })
          : await Order.findAll();
      responseHelper(res, orderList);
    }
    } catch (error) {
      next(error);
    }
  },
  createOrder: async (req, res, next) => {
    const { products, userId } = req.body; 
    try {
      if (!products || !userId) {
        rejectHelper(messages.errors.paramsRequired);
      }

      const productsId = products.map((pr) => pr[0]);
      const productsUnits = products.map((pr) => pr[1]);
      const productsList = await Promise.all(
        productsId.map((prId) => Product.findByPk(prId))
      );

      let totalAmount = 0;
      productsList.forEach((pr, i) => {
        totalAmount += pr.value * productsUnits[i];
      });
      const order = await Order.create({ ...req.body, totalAmount });
      productsList.forEach(async (prId) => {
        await order.addProduct(prId.id);
      });

      const user = await User.findByPk(userId);
      user.addOrder(order.id);

      responseHelper(res, order);
    } catch (error) {
      next(error);
    }
  },
  putOrder: async (req, res, next) => {
    const { id, userId } = req.query;
    try {
      if (!id && !userId) rejectHelper(messages.errors.paramsRequired);
      let order = [];
      if (id) {
        order = await Order.update(req.body, { where: { id: id } });
      } else if (userId) {
        order = await Order.update(req.body, { where: { userId: userId } });
      }
      order[0] < 1
        ? rejectHelper(messages.errors.notOrder)
        : responseHelper(res, messages.status.updateOrder);
    } catch (error) {}
  },
  deleteOrder: async (req, res, next) => {
    const { id } = req.params;
    try {
      if (!id) rejectHelper(messages.errors.paramsRequired);
      const deletedOrder = await Order.destroy({ where: { id: id } });
      deletedOrder < 1
        ? rejectHelper(messages.errors.notOrder)
        : responseHelper(res, messages.status.deleteOrder);
    } catch (error) {
      next(error);
    }
  },
};
