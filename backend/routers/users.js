const express = require('express');

const router = express.Router();

const usersController = require('../controller/users');

router.post('/signup', usersController.createUser);

router.post('/login', usersController.loginUser);

module.exports = router;