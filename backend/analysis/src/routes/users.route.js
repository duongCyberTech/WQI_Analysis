const UserController = require('../controllers/users.controller');
const express = require('express');
const router = express.Router();

router.get('/users', UserController.getUsers);
router.post('/users/verify', UserController.verifyUser);
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;


