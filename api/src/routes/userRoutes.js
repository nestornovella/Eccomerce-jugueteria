const {Router} = require('express')
const { getUsers, createUser, putUser, deleteUser } = require('../controllers/users')

const router = Router()

router.get('/', getUsers)
router.post('/', createUser)
router.put('/', putUser)
router.delete('/:id', deleteUser)

module.exports = router