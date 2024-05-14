const { Router } = require('express');
const Controller = require('../controllers/MovieTagsController');

const router = Router();
const controller = new Controller();

router.get('/', controller.index);
router.get('/:note_id', controller.show);

module.exports = router;
