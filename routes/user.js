const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.get('/', userController.getUser)

router.delete('/', userController.deleteUser)

router.put('/', userController.updateUser)


module.exports = router
