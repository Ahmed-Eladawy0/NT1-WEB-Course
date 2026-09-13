const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user-controllers');
const authenticate = require('../middlewares/authenticate-middleware');
const authorize = require('../middlewares/authorize-middleware');

router.use(authenticate);
router.use(authorize('admin')); 

router.get('/', userControllers.getAllUsers);
router.patch('/:id/role', userControllers.toggleUserRole);
router.delete('/:id', userControllers.deleteUser);

module.exports = router;