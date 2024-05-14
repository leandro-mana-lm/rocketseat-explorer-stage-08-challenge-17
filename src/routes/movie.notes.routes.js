const { Router } = require('express');
const Controller = require('../controllers/MovieNotesController');

const router = Router();
const controller = new Controller();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
