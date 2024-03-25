const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/self', userController.basicAuth, userController.getUser);
router.put('/self', userController.basicAuth, userController.updateUser);
router.get('/verify-email/:token', userController.verifyUser);

module.exports = router;
