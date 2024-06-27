import HttpStatus from "http-status-codes";
import { Request, Response } from "express";
import axios from "axios";
import moment from "moment";
import path from "path";
import { Wallet } from "ethers";
import { ReturnCode } from "@/helper/enums";
import appConfig from "@/config/app.config";
import { Logger } from "@/lib/logger.lib";
import { IController } from "./controller.interface";

// // import { wallet_db } from "@/models/wallet.model";
// import { token_db } from "@/models/token.model";
// // import { template_ver2_db } from "@/models/template2.model";
// // import { withdrawnToken_db } from "@/models/withdrawToken.model";
import { where } from "sequelize/types";
import { Json } from "sequelize/types/lib/utils";
// import operator from "operator";
// import sequelize from "@/models/index";

import {
  mintERC721,
  transferERC721,
  burnERC721,
  transferERC20,
  mintERC20,
  burnERC20,
  ownerOf,
  checkERC20Contract,
  checkERC721Contract,
} from "@/lib/test_nfts_edge2_copy";
import { StardustCustodialSDK } from "@stardust-gg/stardust-custodial-sdk";
import { any } from "sequelize/types/lib/operators";
import { listOperators, Operator } from "@/lib/operators";
import { nonceGlobal } from "@/lib/test_nfts_edge2_copy";
import  BeeQueue = require("bee-queue");


require("dotenv").config(); //initialize dotenv
// let mysql = require("mysql");

const update_totalSuply = async function (supply: number, id: number) {};
// Define a type for transaction requests for clarity
export interface TransactionRequest {
  operatorId: string;
  transactionData: any; // Customize this with the actual data structure
}
// Create a map to hold the queues for each operator
export const operatorQueues: Record<string, BeeQueue<TransactionRequest>> = {};
const maxQueueSize = 3;

//Initial queue for each operator
for (let i = 0; i < listOperators.length; i++) {
  const operatorId = `operator-${listOperators[i].address}`;
  operatorQueues[operatorId] = new BeeQueue<TransactionRequest>(operatorId, {
      redis: {
          host: 'localhost',
          port: 6379,
          db: 0,
      },
      isWorker: true,
      getEvents: false,
      sendEvents: false,
      storeJobs: true,
      ensureScripts: true,
      activateDelayedJobs: true,
      removeOnSuccess: true,
      removeOnFailure: true
  });
}

async function cleanJob() {
  let count = 0
  while (count < listOperators.length){
    const operatorId_tmp = `operator-${listOperators[count].address}`;
    const queue = operatorQueues[operatorId_tmp];
    const queue_health = await queue.checkHealth();
    console.log(queue_health)
    const jobs = await queue.getJobs('waiting', {start: 0, end: 25})
    const jobIds = jobs.map((job) => job.id);
    // console.log(jobIds)
    // if (jobIds.length > 0){
    //   for ( var i = 0; i< jobIds.length; i++){
    //     console.log(jobIds[i])
    //     queue.removeJob(jobIds[i]).then(() => console.log(`Job ${i} was removed`));
    //   }
    // }
    count ++;
    if (count == listOperators.length) break
  };
}
cleanJob()

// Define operator list function
var operator_index: number = 0;
async function selectOpertor() {
  // const operator_:Operator =
  let count = 0
  while (count < listOperators.length){
    const operatorId_tmp = `operator-${listOperators[operator_index].address}`;
    const queue = operatorQueues[operatorId_tmp];
    const queue_health = await queue.checkHealth();
    // console.log(queue_count)
    const queue_count = queue_health.active + queue_health.waiting
    console.log(queue_health)
    console.log(`Queue counts: ${queue_count}`)
    if (Number(queue_count) < maxQueueSize) break;
    if (operator_index === listOperators.length - 1) {
      operator_index = 0;
    } else {
      operator_index++;
    }
    count ++;
  };
  if (count === listOperators.length ){
    throw new Error(JSON.stringify(
      { message: "Enqueue is full. Please try another time."},null,2))
  }
  return listOperators[operator_index]
}


// Chain config
// const Web3 = require("web3");
// const serverNode = process.env.ARBITRUM_RPC;
// const web3 = new Web3(serverNode);
const STARDUST_API_KEY: string = String(process.env.STARDUST_API_KEY);
const sdk = new StardustCustodialSDK(STARDUST_API_KEY);
const options = {method: 'GET', headers: {'x-api-key': STARDUST_API_KEY}};

function onlyNumbers(str: String) {
  var pattern = /[^,0-9]/;

  str = str.replace(pattern, "*");
  str = str.replace(/,0/, ",*");
  var indices = [];
  for (var i = 0; i < str.length; i++) {
    if (str[i] === "*") indices.push(i);
  }
  return indices;
}


async function getWalletFromProfileID(profileID: string) {
  const profile = await sdk.getProfile(profileID);
  // console.log(profile)
  const { wallet } = profile;
  const walletID = wallet.evm.walletId;

  const res = await fetch(`https://vault-api.stardust.gg/v1/wallet/${walletID}?includeAddresses=evm`, options)
  var resultTmp = await res.json()
  // console.log(resultTmp)
  const walletAddressEvm = resultTmp.addresses.evm
  return walletAddressEvm;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export class Token_Controller implements IController {
  public delete(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }

  public put(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }

  public async get(req: Request, res: Response) {
    Promise.reject(new Error("Method not implemented."));
  }

  public async post(req: Request, res: Response) {
    Promise.reject(new Error("Method not implemented."));
  }

  // Get Token (s)
  public async getToken(req: Request, res: Response) {
    Logger.getInstance().info(
      `GET Token  - Accept request from ${req.get("User-Agent")} - ${req.ip}`
    );
    Logger.getInstance().info(
      `GET Token  - Request with params ${JSON.stringify(req.query)}`
    );
    var status;
    try {
      var array = String(req.query.tokenIds); //Math.round(Math.random() * 5 + 1);
      // console.log(array,typeof array)
      array = array.replace("[", "");
      array = array.replace("]", "");
      const check_array = onlyNumbers(array);
      if (check_array.length != 0) {
        var err_ = JSON.stringify(
          {
            message:
              "Unexpected number in JSON at position ${check_array[0] +1 }",
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          null,
          2
        );
        throw new Error(err_);
      }
      let tokenId_ = array.split(",").map(Number);

      var res_test = JSON.stringify({}, null, 2);
      Logger.getInstance().info(`Get Tokens success `);
      res.status(HttpStatus.OK).send(res_test);
    } catch (err) {
      Logger.getInstance().error(`Get Token error`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(getErrorMessage(err));
    }
  }

  // Transfer Token (s)
  public async transferTokenWallet(req: Request, res: Response) {
    Logger.getInstance().info(
      `Transfer Token by Wallet - Accept request from ${req.get("User-Agent")} - ${req.ip}`
    );
    Logger.getInstance().info(
      `Transfer Token by Wallet - Request with body ${JSON.stringify(req.body)}`
    );
    var status_error = HttpStatus.INTERNAL_SERVER_ERROR;
    var message_error;
    try {
      //Check invalid req body
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        status_error = HttpStatus.BAD_REQUEST;
        message_error = JSON.stringify(
          { message: "Invalid request body" },
          null,
          2
        );
        throw new Error(message_error);
      }
      const fromWallet = req.body.fromWallet;
      const toWallet = req.body.toWallet;
      // console.log(`From: ${fromWallet} - To: ${toWallet}`)
      const contractAddress_ = req.body.contractAddress;
      const tokenId_ = req.body.tokenId;
      //Check self transfer
      if (fromWallet === toWallet) {
        status_error = HttpStatus.INTERNAL_SERVER_ERROR;
        message_error = JSON.stringify(
          {
            message: "Cannot transfer to self",
            stack: "Error: Cannot transfer to self",
          },
          null,
          2
        );
        throw new Error(message_error);
      }
      // Check contract address type
      const isERC721Contract = await checkERC721Contract(contractAddress_);
      // Select operator
      var operator_tmp: Operator = await selectOpertor();
      let operatorId_tmp = `operator-${operator_tmp.address}`;
      let queue = operatorQueues[operatorId_tmp];
      Logger.getInstance().info(`operator_tmp ${operator_tmp.address}`);
      // Transfer token for ERC20 if contract type is ERC20
      if (isERC721Contract) {
        // Transfer token for ERC721 if contract type is ERC721
        Logger.getInstance().info(
          `Contract ${contractAddress_} type is ERC721`
        );
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await transferERC721(
            fromWallet,
            toWallet,
            tokenId_,
            operator_tmp.address,
            operator_tmp.privateKey,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when TRANSFER Token ${tokenId_} from ${fromWallet} to ${toWallet} with reason ${message} `,
            },
            null,
            2
          );
          throw new Error(message_error);
        }
      } else {
        Logger.getInstance().info(`Contract ${contractAddress_} type is ERC20`);
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await transferERC20(
            fromWallet,
            toWallet,
            tokenId_,
            operator_tmp.address,
            operator_tmp.privateKey,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when TRANSFER amount ${tokenId_} from ${fromWallet} to ${toWallet} with reason ${message} `,
            },
            null,
            2
          );
          throw new Error(message_error);
        }
      }
    } catch (err) {
      Logger.getInstance().error(
        `Transfer token using Wallet error: ${getErrorMessage(err)}`
      );
      res.status(status_error).send(getErrorMessage(err));
    }
  }

  // Burn Token(s)
  public async burnTokenWallet(req: Request, res: Response) {
    Logger.getInstance().info(
      `BURN TOKEN using Wallet - Accept request from ${req.get("User-Agent")} - ${req.ip}`
    );
    Logger.getInstance().info(
      `BURN TOKEN using Wallet - Request with body ${JSON.stringify(req.body)}`
    );
    var status_error = HttpStatus.INTERNAL_SERVER_ERROR;
    var message_error;
    try {
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        status_error = HttpStatus.BAD_REQUEST;
        message_error = JSON.stringify(
          { message: "Invalid request body" },
          null,
          2
        );
        throw new Error(message_error);
      }
      const targetAddress = req.body.targetAddress
      const contractAddress_ = req.body.contractAddress;
      const tokenId_ = req.body.tokenId;
      // Check contract address type
      const isERC721Contract = await checkERC721Contract(contractAddress_);
      // Select operator
      var operator_tmp: Operator = await selectOpertor();
      let operatorId_tmp = `operator-${operator_tmp.address}`;
      let queue = operatorQueues[operatorId_tmp];
      Logger.getInstance().info(`operator_tmp ${operator_tmp.address}`);
      // Transfer token for ERC20 if contract type is ERC20
      if (isERC721Contract) {
        // Transfer token for ERC721 if contract type is ERC721
        Logger.getInstance().info(
          `Contract ${contractAddress_} type is ERC721`
        );
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await burnERC721(
            operator_tmp.address,
            operator_tmp.privateKey,
            tokenId_,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          nonceGlobal.decrement(operator_tmp.address);
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when BURN token ${tokenId_} of contract ${contractAddress_} with reason ${message} `,
            },
            null,
            2
          );
          throw new Error(message_error);
        }
      } else {
        Logger.getInstance().info(`Contract ${contractAddress_} type is ERC20`);
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await burnERC20(
            targetAddress,
            operator_tmp.address,
            operator_tmp.privateKey,
            tokenId_,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          nonceGlobal.decrement(operator_tmp.address);
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when BURN using Wallet amount ${tokenId_} of contract ${contractAddress_} with reason ${message} `,
            },null,2);
          throw new Error(message_error);
        }
      }
    } catch (err) {
      Logger.getInstance().error(`Burn token using Wallet error: ${getErrorMessage(err)}`);
      res.status(status_error).send(getErrorMessage(err));
    }
  }

  // Bulk Mint Tokens
  public async mintTokenWallet(req: Request, res: Response) {
    Logger.getInstance().info(
      `BULK MINT TOKEN using Wallet - Accept request from ${req.get("User-Agent")} - ${
        req.ip
      }`
    );
    Logger.getInstance().info(
      `BULK MINT TOKEN using Wallet - Request with body ${JSON.stringify(req.body)}`
    );
    var status_error = HttpStatus.INTERNAL_SERVER_ERROR;
    var message_error;
    try {
      //Check invalid req body
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        status_error = HttpStatus.BAD_REQUEST;
        message_error = JSON.stringify(
          { message: "Invalid request body" },
          null,
          2
        );
        throw new Error(message_error);
      }
      const targetAddress = req.body.targetAddress;
      // console.log(`From: ${fromWallet} - To: ${toWallet}`)
      const contractAddress_ = req.body.contractAddress;
      const tokenId_ = req.body.tokenId;
      // Check contract address type
      const isERC721Contract = await checkERC721Contract(contractAddress_);
      // Select operator
      var operator_tmp: Operator = await selectOpertor();
      let operatorId_tmp = `operator-${operator_tmp.address}`;
      let queue = operatorQueues[operatorId_tmp];
      Logger.getInstance().info(`operator_tmp ${operator_tmp.address}`);
      // Transfer token for ERC20 if contract type is ERC20
      if (isERC721Contract) {
        // Transfer token for ERC721 if contract type is ERC721
        Logger.getInstance().info(
          `Contract ${contractAddress_} type is ERC721`
        );
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await mintERC721(
            operator_tmp.address,
            operator_tmp.privateKey,
            targetAddress,
            tokenId_,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          nonceGlobal.decrement(operator_tmp.address);
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when MINT using Wallet Token ${tokenId_} to ${targetAddress} with reason ${message} `,
            },
            null,
            2
          );
          throw new Error(message_error);
        }
      } else {
        Logger.getInstance().info(`Contract ${contractAddress_} type is ERC20`);
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await mintERC20(
            operator_tmp.address,
            operator_tmp.privateKey,
            targetAddress,
            tokenId_,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          nonceGlobal.decrement(operator_tmp.address);
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when MINT using Wallet amount ${tokenId_} to ${targetAddress} with reason ${message} `,
            },null,2);
          throw new Error(message_error);
        }
      }
    } catch (err) {
      Logger.getInstance().error(
        `Bulk mint token using Wallet error: ${getErrorMessage(err)}`
      );
      res.status(status_error).send(getErrorMessage(err));
    }
  }

  // Transfer Token using ProfileID(s)
  public async transferTokenProfileID(req: Request, res: Response) {
    Logger.getInstance().info(
      `Transfer Token using ProfileID - Accept request from ${req.get("User-Agent")} - ${
        req.ip
      }`
    );
    Logger.getInstance().info(
      `Transfer Token using ProfileID - Request with body ${JSON.stringify(req.body)}`
    );

    var status_error = HttpStatus.INTERNAL_SERVER_ERROR;
    var message_error;
    try {
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        status_error = HttpStatus.BAD_REQUEST;
        message_error = JSON.stringify(
          { message: "Invalid request body" },
          null,
          2
        );
        throw new Error(message_error);
      }
      const contractAddress_ = req.body.contractAddress;
      const tokenId_ =req.body.tokenId
      const fromProfileId = req.body.fromProfileId;
      const toProfileId = req.body.toProfileId;
      const fromWallet = await getWalletFromProfileID(fromProfileId)
      const toWallet = await getWalletFromProfileID(toProfileId)
      console.log(`fromWallet ${fromWallet}`)
      console.log(`toWallet ${toWallet}`)
      //Check self transfer
      if (fromWallet === toWallet) {
        status_error = HttpStatus.INTERNAL_SERVER_ERROR;
        message_error = JSON.stringify(
          {
            message: "Cannot transfer to self",
            stack: "Error: Cannot transfer to self",
          },
          null,
          2
        );
        throw new Error(message_error);
      }
      // Check contract address type
      const isERC721Contract = await checkERC721Contract(contractAddress_);
      // Select operator
      var operator_tmp: Operator = await selectOpertor();
      let operatorId_tmp = `operator-${operator_tmp.address}`;
      let queue = operatorQueues[operatorId_tmp];
      Logger.getInstance().info(`operator_tmp ${operator_tmp.address}`);
      // Transfer token for ERC20 if contract type is ERC20
      if (isERC721Contract) {
        // Transfer token for ERC721 if contract type is ERC721
        Logger.getInstance().info(
          `Contract ${contractAddress_} type is ERC721`
        );
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await transferERC721(
            fromWallet,
            toWallet,
            tokenId_,
            operator_tmp.address,
            operator_tmp.privateKey,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          nonceGlobal.decrement(operator_tmp.address);
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when TRANSFER Token ${tokenId_} from ${fromWallet} to ${toWallet} with reason ${message} `,
            },
            null,
            2
          );
          throw new Error(message_error);
        }
      } else {
        Logger.getInstance().info(`Contract ${contractAddress_} type is ERC20`);
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await transferERC20(
            fromWallet,
            toWallet,
            tokenId_,
            operator_tmp.address,
            operator_tmp.privateKey,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when TRANSFER amount ${tokenId_} from ${fromWallet} to ${toWallet} with reason ${message} `,
            },
            null,
            2
          );
          throw new Error(message_error);
        }
      }
    } catch (err) {
      Logger.getInstance().error(
        `Transfer token using ProfileID error: ${getErrorMessage(err)}`
      );
      console.log(err)
      res.status(status_error).send(getErrorMessage(err));
    }
  }

  // Burn Token using ProfileID(s)
  public async burnTokenProfileID(req: Request, res: Response) {
    Logger.getInstance().info(
      `BURN TOKEN using ProfileID - Accept request from ${req.get("User-Agent")} - ${req.ip}`
    );
    Logger.getInstance().info(
      `BURN TOKEN using ProfileID - Request with body ${JSON.stringify(req.body)}`
    );
    var status_error = HttpStatus.INTERNAL_SERVER_ERROR;
    var message_error;
    try {
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        status_error = HttpStatus.BAD_REQUEST;
        message_error = JSON.stringify(
          { message: "Invalid request body" },
          null,
          2
        );
        throw new Error(message_error);
      }
      const contractAddress_ = req.body.contractAddress;
      const tokenId_ =req.body.tokenId
      const targetProfileId = req.body.targetProfileId;
      const targetAddress = await getWalletFromProfileID(targetProfileId)
      // Check contract address type
      const isERC721Contract = await checkERC721Contract(contractAddress_);
      // Select operator
      var operator_tmp: Operator = await selectOpertor();
      let operatorId_tmp = `operator-${operator_tmp.address}`;
      let queue = operatorQueues[operatorId_tmp];
      Logger.getInstance().info(`operator_tmp ${operator_tmp.address}`);
      // Transfer token for ERC20 if contract type is ERC20
      if (isERC721Contract) {
        // Transfer token for ERC721 if contract type is ERC721
        Logger.getInstance().info(
          `Contract ${contractAddress_} type is ERC721`
        );
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await burnERC721(
            operator_tmp.address,
            operator_tmp.privateKey,
            tokenId_,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          nonceGlobal.decrement(operator_tmp.address);
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when BURN token ${tokenId_} of contract ${contractAddress_} with reason ${message} `,
            },
            null,
            2
          );
          throw new Error(message_error);
        }
      } else {
        Logger.getInstance().info(`Contract ${contractAddress_} type is ERC20`);
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await burnERC20(
            targetAddress,
            operator_tmp.address,
            operator_tmp.privateKey,
            tokenId_,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          nonceGlobal.decrement(operator_tmp.address);
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when BURN using Wallet amount ${tokenId_} of contract ${contractAddress_} with reason ${message} `,
            },null,2);
          throw new Error(message_error);
        }
      }

    } catch (err) {
      Logger.getInstance().error(`Burn token using ProfileID error: ${getErrorMessage(err)}`);
      res.status(status_error).send(getErrorMessage(err));
    }
  }

  // Bulk Mint Tokens using ProfileID
  public async mintTokenProfileID(req: Request, res: Response) {
    Logger.getInstance().info(
      `MINT TOKEN using ProfileID - Accept request from ${req.get("User-Agent")} - ${
        req.ip
      }`
    );
    Logger.getInstance().info(
      `MINT TOKEN using ProfileID - Request with body ${JSON.stringify(req.body)}`
    );
    var status_error = HttpStatus.INTERNAL_SERVER_ERROR;
    var message_error;
    try {
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        status_error = HttpStatus.BAD_REQUEST;
        message_error = JSON.stringify(
          { message: "Invalid request body" },
          null,
          2
        );
        throw new Error(message_error);
      }
      const contractAddress_ = req.body.contractAddress;
      const tokenId_ =req.body.tokenId
      const targetProfileId = req.body.targetProfileId;
      const targetAddress = await getWalletFromProfileID(targetProfileId)
      // Check contract address type
      const isERC721Contract = await checkERC721Contract(contractAddress_);
      // Select operator
      var operator_tmp: Operator = await selectOpertor();
      let operatorId_tmp = `operator-${operator_tmp.address}`;
      let queue = operatorQueues[operatorId_tmp];
      Logger.getInstance().info(`operator_tmp ${operator_tmp.address}`);
      if (isERC721Contract) {
        // Transfer token for ERC721 if contract type is ERC721
        Logger.getInstance().info(
          `Contract ${contractAddress_} type is ERC721`
        );
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await mintERC721(
            operator_tmp.address,
            operator_tmp.privateKey,
            targetAddress,
            tokenId_,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          nonceGlobal.decrement(operator_tmp.address);
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when MINT using Wallet Token ${tokenId_} to ${targetAddress} with reason ${message} `,
            },
            null,
            2
          );
          throw new Error(message_error);
        }
      } else {
        Logger.getInstance().info(`Contract ${contractAddress_} type is ERC20`);
        const time_transfer = Date.now();
        let [result_transfer, message]:any = await mintERC20(
            operator_tmp.address,
            operator_tmp.privateKey,
            targetAddress,
            tokenId_,
            contractAddress_,
            queue
          );
        const time_finishtransfer = Date.now() - time_transfer;
        console.log(`Time Transfer on BlockChain: ${time_finishtransfer}`);
        // res.send(result_transfer)
        if (result_transfer) {
          Logger.getInstance().info(
            `The transaction hash success is: ${message}`
          );
          res.status(HttpStatus.OK).send(`The transaction hash success is: ${message}`);
        } else {
          nonceGlobal.decrement(operator_tmp.address);
          status_error = HttpStatus.INTERNAL_SERVER_ERROR;
          message_error = JSON.stringify(
            {
              message: `ERROR when MINT using Wallet amount ${tokenId_} to ${targetAddress} with reason ${message} `,
            },null,2);
          throw new Error(message_error);
        }
      }
      // res.send(ownerOf(1))
    } catch (err) {
      Logger.getInstance().error(
        `Bulk mint token using ProfileID error: ${getErrorMessage(err)}`
      );
      res.status(status_error).send(getErrorMessage(err));
    }
  }

}

