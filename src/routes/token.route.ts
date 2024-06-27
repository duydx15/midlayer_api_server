import express from 'express';
import cors from 'cors';
import { camelcase } from '@/config/middleware.config'

import { Logger } from '../lib/logger.lib';
import { Token_Controller } from '@/controllers/token.controller';

class Token_Route {
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
    const controller = new Token_Controller();


    this.express.get('/get', (req, res) => {
      controller.getToken(req, res)
        .catch(err => {
          Logger.getInstance().error(err)
        });
    });
    this.express.post('/transfer', async (req, res) => {
      controller.transferTokenWallet(req, res)
        .catch(err => {
          Logger.getInstance().error(err)
        });
    });
    this.express.post('/mint', async (req, res) => {
      controller.mintTokenWallet(req, res)
        .catch(err => {
          Logger.getInstance().error(err)
        });
    });
    this.express.post('/burn', async (req, res) => {
      controller.burnTokenWallet(req, res)
        .catch(err => {
          Logger.getInstance().error(err)
        });
    });
    this.express.post('/mint-profileid', async (req, res) => {
      controller.mintTokenProfileID(req, res)
        .catch(err => {
          Logger.getInstance().error(err)
        });
    });
    this.express.post('/burn-profileid', async (req, res) => {
      controller.burnTokenProfileID(req, res)
        .catch(err => {
          Logger.getInstance().error(err)
        });
    });
    this.express.post('/transfer-profileid', async (req, res) => {
      controller.transferTokenProfileID(req, res)
        .catch(err => {
          Logger.getInstance().error(err)
        });
    });
  }
}

export default new Token_Route().express;
