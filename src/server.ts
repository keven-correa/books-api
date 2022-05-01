import { config } from './config/config';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import Logging from './library/logging';
import authorRoutes from './routes/author.routes';
import bookRoutes from './routes/book.routes'

const router = express();

//connect to mongo
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info(`Connected to MongoDb.`);
        StartServer();
    })
    .catch((error) => {
        Logging.error(`Unable to connect.`);
        Logging.error(error);
    });

//Only start the server if Mongo Connects

const StartServer = () => {
    router.use((req: Request, res: Response, next: NextFunction) => {
        //Log the request
        Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        req.on('finish', () => {
            //Log the response
            Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status [${res.statusCode}]`);
        });
        next();
    });
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    router.use((req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    //Routes
    router.use('/authors/', authorRoutes);
    router.use('/books/', bookRoutes);
    //HealthCheck
    router.get('/ping', (req: Request, res: Response, next: NextFunction) => res.status(200).json({ message: 'Server is alive' }));

    //Error handling
    router.use((req: Request, res: Response, next: NextFunction) => {
        const error = new Error('not found');
        Logging.error(error);
        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server running on port ${config.server.port}`));
};
