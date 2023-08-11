const {Router} = require('express')
const router = Router()
const userRoutes = require('./userRoutes')
const orderRoutes = require('./orderRouter')
const productRoutes = require('./productRoutes')
const categoryRoutes = require('./categoryRoutes')
const loginRoutes = require('./loginRoutes')

router.use('/user', userRoutes )
router.use('/order', orderRoutes )
router.use('/product', productRoutes)
router.use('/category', categoryRoutes)
router.use('/login', loginRoutes)
module.exports = router