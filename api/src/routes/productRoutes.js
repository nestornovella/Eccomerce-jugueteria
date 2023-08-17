const {Router} = require('express')
const { createProduct, getProduct, putProduct, deleteProduct, seedProducts } = require('../controllers/product')


const router = Router()

router.post('/', createProduct)
router.post('/seedProduct', seedProducts)
router.get('/', getProduct)
router.put('/', putProduct)
router.delete('/:id', deleteProduct)
module.exports = router