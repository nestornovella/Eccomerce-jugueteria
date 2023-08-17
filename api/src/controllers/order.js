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
        const order = await Order.findByPk(id);
        if (!order) {
          rejectHelper(messages.errors.notOrder);
        }
        let productList = [];
        for (const pr of order.products) {
          const product = await Product.findByPk(pr.id);
          productList.push({
            id: pr.id,
            units: pr.units,
            total: product.value * pr.units,
          });
        }

        order.products = productList;
        responseHelper(res, order);
      } else if (userId) {
        const ordersList = await Order.findAll({
          where: { userId: userId },
          include: { model: Product },
        });

        for (const or of ordersList) {
          let total = 0;
          for (const prod of or.products) {
            const product = await Product.findByPk(prod.id);
            total += product.value * prod.units;
            prod.total = total;
            total = 0;
          }
        }

        responseHelper(res, ordersList);
      } else {
        const orderList = await Order.findAll();
        if (!orderList.length) responseHelper(res, []);
        const response = orderList.map((ord) => {
          return { id: ord.id, userId: ord.userId, products: ord.products };
        });
        responseHelper(res, response);
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

      const order = await Order.create(req.body);
      const user = await User.findByPk(userId);
      user.addOrder(order.id);

      for(const prod of products){
        const product = await Product.findByPk(prod.id)
        await Product.update({stock:product.stock - prod.units},{where:{id: prod.id}})
      }

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
  cancelOrder: async (req, res, next) => {
    const { id } = req.query;
    try {
      if (!id) rejectHelper(messages.errors.paramsRequired);
      const order = await Order.findByPk(id)

      for(const prod of order.products){
        const product = await Product.findByPk(prod.id)
        await Product.update({stock:product.stock + prod.units},{where:{id: prod.id}})
      }

      const deletedOrder = await Order.destroy({where:{id: id}})
      deletedOrder < 1
      ? rejectHelper(messages.errors.notOrder)
      : responseHelper(res, messages.status.deleteOrder);

    } catch (error) {
      next(error);
    }
  },
};
