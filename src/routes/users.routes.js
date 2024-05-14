const { Router } = require('express');
const Controller = require('../controllers/UsersController');

const router = Router();
const controller = new Controller();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.patch('/:id', controller.update);

module.exports = router;
