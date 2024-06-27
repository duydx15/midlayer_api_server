import express from 'express';
import cors from 'cors';
import { camelcase } from '@/config/middleware.config'

import { Logger } from '../lib/logger.lib';
import { Fun_Controller } from '@/controllers/fun.controller';

class Fun_Route {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(camelcase());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cors());
  }

  private routes(): void {
    const controller = new Fun_Controller();

    this.express.post('/fun', async (req, res, next) => {
      await controller.fun(req, res)
        .catch(err => {
          Logger.getInstance().error(err)
        });
    });

  }
}

export default new Fun_Route().express;
