import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import redis from 'redis';
import router from './src/routes/v1';
import env from './src/config/env';
import logger from './src/config/logger';
import { connectToDB } from './src/config/dbConnect';
import { errorResponse } from './src/utils/HttpResponse';
import deSerializeUser from './src/middleware/deSerializeUser';
import { globalErrorHandler } from './src/middleware/globalErrorHandler';




(async () => {
  const app = express();
  const redisClient = redis.createClient()

  app.use(bodyParser.json());

  app.use(cors(env.cors ? { origin: env.cors, optionsSuccessStatus: 200 } : undefined));

  morgan.token('level', (req: Request, res: Response) => {
    const statusCode = res.statusCode;
    if (statusCode >= 500) {
      return '[ERROR]';
    } else if (statusCode >= 400) {
      return '[WARN]';
    } else {
      return '[INFO]';
    }
  });
  app.use(
    morgan(':date[iso] :level :method :url :status :res[content-length] :referrer :total-time[5] - :response-time ms'),
  );

  app.use(deSerializeUser)

  app.use('/api/v1', router);
  app.use(globalErrorHandler);
  //Add your route path prefix

  app.all('*', (req: Request, res: Response) => {
    errorResponse({
      response: res,
      message: 'Path Not Found',
      status: 404,
    });
  });

  app.listen(env.port, async () => {
    await connectToDB();
    console.log(`The application is listening on port \x1b[4m\x1b[31m${env.port}\x1b[0m`);
  });

  process.on('SIGINT', () => {
    process.exit();
  });
  // Unhandled Promise Rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(JSON.stringify({ message: `Unhandled Rejection at:, ${promise}`, error: reason }));
  });

  // Unhandled Exceptions
  process.on('uncaughtException', error => {
    logger.error(JSON.stringify({ message: `Uncaught Exception:, ${error}` }));
  });
})();
