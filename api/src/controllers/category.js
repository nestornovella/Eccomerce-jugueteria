const { Category } = require("../db");
const { responseHelper, rejectHelper } = require("../helpers/response");

const messages = {
  errors: {
    notFounded: "category not founded",
    paramsReequired: "params be required",
    categoryExist: "the category you want to crate all ready exist",
    notUpdate: "the category cant be update",
  },
  status: {
    updated: "category was updated",
    deleteCat: "category was deleted"
  },
};

module.exports = {
  getCategory: async (req, res, next) => {
    const { name, id } = req.query;
    try {
      if (name) {
        const category = await Category.findOne({ where: { name: name } });
        !category
          ? rejectHelper(messages.errors.notFounded)
          : responseHelper(res, category);
      } else if (id) {
        const category = await Category.findByPk(id);
        !category
          ? rejectHelper(messages.errors.notFounded)
          : responseHelper(res, category);
      } else {
        const allCategory = await Category.findAll();
        responseHelper(res, allCategory);
      }
    } catch (error) {
      next(error);
    }
  },
  createCategory: async (req, res, next) => {
    const { name } = req.body;
    try {
      if (!name) rejectHelper(messages.errors.paramsReequired);
      const verify = await Category.findOne({ where: { name: name } });
      if (verify) rejectHelper(messages.errors.categoryExist);
      else {
        const newCategory = await Category.create(req.body);
        responseHelper(res, newCategory);
      }
    } catch (error) {
      next(error);
    }
  },
  putCategory: async (req, res, next) => {
    const { id, name } = req.query;
    let category;
    try {
      if (!id && !name) rejectHelper(messages.errors.paramsReequired);
      else if (id) {
        category = await Category.update(req.body, { where: { id: id } });
      } else if (name) {
        category = await Category.update(req.body, { where: { name: name } });
      }
      if (Array.isArray(category)) {
        category[0] < 1
          ? rejectHelper(messages.errors.notUpdate)
          : responseHelper(res, messages.status.updated);
      } else {
        rejectHelper("error in the response");
      }
    } catch (error) {}
  },
  deleteCategory: async (req, res, next) => {
    const { id } = req.params;
    try {
      if (!id) rejectHelper(messages.errors.paramsReequired);
      const deletedCa = await Category.destroy({ where: { id: id } });
      deletedCa < 1 
      ? rejectHelper(messages.errors.notFounded)
      : responseHelper(res, messages.status.deleteCat)
    } catch (error) {
      next(error);
    }
  },
};
