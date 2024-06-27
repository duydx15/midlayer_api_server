import express from 'express';
import morgan from 'morgan';
import path from 'path';
import compression from 'compression';
import moment from 'moment-timezone';
import { createStream } from 'rotating-file-stream';
import helmet from 'helmet';
import rateLimit from "express-rate-limit";

import Routes from '@/routes/routes';
// import db from '@/models/';
import { Logger } from '@/lib/logger.lib';

const morganConfig = () => {
  morgan.token('date', (req, res, tz) => {
    return moment().tz(tz?.toString() || '').format();
  })

  morgan.format('timezoneFormat', ':remote-addr [:date[Asia/Ho_Chi_Minh]] ":method :url" :status :res[content-length] ":user-agent" - :response-time ms');

  return morgan('timezoneFormat', {
    stream: createStream('access.log', {
      interval: '1d',
      path: path.join(__dirname, 'logs/access_log')
    })
  })
}

class App {

  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.set('trust proxy', true);
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(morganConfig());
    this.express.use(rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 100000 // limit each IP to 100000 requests per windowMs
    }));
    // db.sync({ force: false }).then(() => {
    //   Logger.getInstance().info("Re-sync database.");
    // });
  }

  private routes(): void {
    // homepage
    this.express.get('/', (req, res, next) => {
      res.send('Hello World')
    });

    // download app
    this.express.get('/download-app', function (req, res) {
      const file = `${__dirname}/download/achilles-app.apk`;
      res.sendFile(file);
    })

    // Qrcode
    this.express.get('/download-qr', function (req, res) {
      const file = `${__dirname}/download/download-link.png`;
      res.sendFile(file);
    })

    // use route
    this.express.use('/api', Routes);

    // handle undefined routes
    this.express.use('*', (req, res, next) => {
      res.send('Make sure url is correct!');
    });
  }
}

export default new App().express;
