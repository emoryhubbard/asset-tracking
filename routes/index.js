const express = require('express');
const router = express.Router();
const verifyLogin = require('../middleware/auth')


router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.send(req.user.displayName + ', Welcome to asset tracking made easy.');
    } else {
        res.send('Welcome to asset tracking made easy. Please login.');
    }
  });

router.use('/auth', require('./auth'));
router.use('/assets', require('./asset'));
router.use('/location', require('./asset'));
router.use('/building', require('./asset'));
router.use('/departments', require('./department'));
router.use('/user', require('./user'));

module.exports = router;