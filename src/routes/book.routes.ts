import express from 'express';
import controller from '../controllers/book.controller';

const router = express.Router();

router.post('/create', controller.createBook);
router.get('/get/:bookId', controller.getBook);
router.get('/get/', controller.getBooks);
router.patch('/update/:bookId', controller.updateBook);
router.delete('/delete/:bookId', controller.deleteBook);

export = router;
