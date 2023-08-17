const { Product, Category, Op, path, fs } = require("../db");
const { rejectHelper, responseHelper } = require("../helpers/response");

// id,
// name,
// active,
// stock,
// weight,
// width,
// height,
// description,
// Image
const messages = {
  errors: {
    paramsRequired: "params required",
    notUpdated: "the product cant be updated",
    notDeleted: "the product cant be deleted",
    seedNotFund: "seed not funded",
  },
  status: {
    noProducts: "products not founded",
    noProduct: "product not founded",
    updated: "product updated",
    deleted: "the product was deleted",
  },
};

module.exports = {
  seedProducts: async (req, res, next) => {
    try {
      const pathSeed = path.join(__dirname, "..", "seeders");
      const verifySeed = fs.readdirSync(pathSeed);
      if (!verifySeed.includes("Products.Json"))
        rejectHelper(messages.errors.seedNotFund);
      const seeder = JSON.parse(
        fs.readFileSync(path.join(__dirname, "..", "seeders", "Products.Json"))
      );
      for (const prod of seeder) {
        const categoriesList = await Promise.all(prod.categories.map((cat) => {
          return Category.findOrCreate({
            where: { name: cat },
            defaults: { name: cat },
          });
        }))
        const product = await Product.create(prod);
        if (product) {
          if(categoriesList.length){
            await Promise.all(
              categoriesList.map(categ => {
                return product.addCategory(categ[0].id)
              })
            )
          }
        }
      }
      const response = await Product.findAll({include:{model:Category,  model: Category,
        attributes: ["id", "name"],
        through: { attributes: [] },}})
      responseHelper(res, response)
    } catch (error) {
      next(error);
    }
  },
  createProduct: async (req, res, next) => {
    const { name, image, stock, categories } = req.body;
    try {
      if (!image || !name || !stock) {
        rejectHelper("faltan parametros");
      }
      const newProduct = await Product.create(req.body);
      if (categories.length) {
        const categoriesListPromise = categories.map((cat) => {
          return Category.findOrCreate({
            where: { name: cat },
            defaults: { name: cat },
          });
        });
        const categoriesList = await Promise.all(categoriesListPromise);
        categoriesList.forEach((e) => newProduct.addCategory(e[0].id));
      }

      responseHelper(res, newProduct);
    } catch (error) {
      next(error);
    }
  },
  getProduct: async (req, res, next) => {
    const { id, name } = req.query;
    try {
      if (id) {
        const product = await Product.findByPk(id, {
          include: {
            model: Category,
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        });
        !product
          ? rejectHelper(messages.status.noProduct)
          : responseHelper(res, product);
      } else if (name) {
        const product = await Product.findAll({
          where: {
            name: {
              [Op.iLike]: `%${name}%`,
            },
          },
          include: {
            model: Category,
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        });
        !product
          ? rejectHelper(messages.status.noProduct)
          : responseHelper(res, product);
      } else {
        const productList = await Product.findAll({
          include: {
            model: Category,
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        });
        responseHelper(res, productList);
      }
    } catch (error) {
      next(error);
    }
  },
  putProduct: async (req, res, next) => {
    const { id } = req.body;
    try {
      if (!id) rejectHelper(messages.errors.paramsRequired);
      const productUpdated = await Product.update(req.body, {
        where: { id: id },
      });
      productUpdated < 1
        ? rejectHelper(messages.errors.notUpdated)
        : responseHelper(res, messages.status.updated);
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    const { id } = req.params;

    try {
      if (!id) rejectHelper(messages.errors.paramsRequired);

      const deleteProduct = await Product.destroy({ where: { id: id } });
      deleteProduct < 1
        ? rejectHelper(messages.errors.notDeleted)
        : responseHelper(res, messages.status.deleted);
    } catch (error) {
      next(error);
    }
  },
};
