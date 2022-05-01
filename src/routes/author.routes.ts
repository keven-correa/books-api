import express from "express";
import controller from '../controllers/author.controller';

const router = express.Router();

router.post('/create', controller.createAuthor);
router.get('/get/:authorId', controller.getAuthor);
router.get('/get/', controller.getAllAuthors);
router.patch('/update/:authorId', controller.updateAuthor);
router.delete('/delete/:authorId', controller.deleteAuthor);

export = router;