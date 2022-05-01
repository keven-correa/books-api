import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Book from '../models/book.model';

function createBook(req: Request, res: Response, next: NextFunction) {
    const { author, title } = req.body;

    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        author,
        title
    });

    return book
        .save()
        .then((book) => res.status(201).json({ book }))
        .catch((error) => res.status(500).json({ error }));
}

function getBook(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.bookId;

    return Book.findById(bookId)
        .populate('author')
        .then((book) => (book ? res.status(200).json({ book }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
}

function getBooks(req: Request, res: Response){
    return Book.find()
        .populate('author')
        .then((books) => res.status(200).json({ books }))
        .catch((error) => res.status(500).json({ error }));
}

function updateBook(req: Request, res: Response){
    const bookId = req.params.bookId;

    return Book.findById(bookId)
        .then((book) => {
            if (book) {
                book.set(req.body);

                return book
                    .save()
                    .then((book) => res.status(201).json({ book }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
}

function deleteBook(req: Request, res: Response){
    const bookId = req.params.bookId;

    return Book.findByIdAndDelete(bookId)
        .then((book) => (book ? res.status(201).json({ book, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
}

export default { createBook, getBook, getBooks, updateBook, deleteBook };
