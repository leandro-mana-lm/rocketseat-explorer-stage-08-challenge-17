const { Router } = require('express');

const router = Router();

const usersRouter = require('./users.routes');
const movieNotesRouter = require('./movie.notes.routes');
const movieTagsRouter = require('./movie.tags.routes');

router.use('/users', usersRouter);
router.use('/movie-notes', movieNotesRouter);
router.use('/movie-tags', movieTagsRouter);

module.exports = router;
