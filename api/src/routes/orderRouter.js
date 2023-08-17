const {Router} = require('express')
const router = Router()
const { getOrder, createOrder, deleteOrder, putOrder, cancelOrder } = require('../controllers/order')


router.get('/', getOrder )
router.post('/',createOrder)
router.put('/', putOrder)
router.delete('/cancel', cancelOrder)
router.delete('/:id', deleteOrder)
module.exports = router