const {Router} = require('express')
const router = Router()
const { getOrder, createOrder, deleteOrder, putOrder } = require('../controllers/order')


router.get('/', getOrder )
router.post('/',createOrder)
router.put('/', putOrder)
router.delete('/:id', deleteOrder)

module.exports = router