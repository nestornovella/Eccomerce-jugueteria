const {Router}= require('express')
const { createToken, verifyToken } = require('../controllers/login')

const router = Router()


router.post('/', createToken)
router.post('/verify', verifyToken)

module.exports = router