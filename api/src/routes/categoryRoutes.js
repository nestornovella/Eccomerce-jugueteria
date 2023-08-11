const {Router}= require('express')
const { getCategory, createCategory, putCategory, deleteCategory } = require('../controllers/category')

const router = Router()

router.get('/', getCategory)
router.post('/', createCategory)
router.put('/', putCategory)
router.delete('/:id', deleteCategory)

module.exports = router