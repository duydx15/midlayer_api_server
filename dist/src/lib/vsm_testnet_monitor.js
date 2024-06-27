"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Script to monitor vsm founder nft transfer.
 *
 */
require('dotenv').config(); //initialize dotenv
const { createClient } = require('redis');
const Web3 = require('web3');
const fs = require('fs');
const winston = require('./utils').winston;
const apiUrl = 'https://polygonedge-test.anlab.info';
const testNetContractAddress = '0x3C46A8127083EF698A32daDdB6Bc9b919612F207';
const testNetBuild = JSON.parse(fs.readFileSync('./build/contracts/TestPassEdge.json', 'utf8'));
const lastCheckedBlockKey = `${testNetContractAddress}:lastCheckedBlock`;
const sleep = function (ms) {
    return __awaiter(this, void 0, void 0, function* () { return new Promise(resolve => setTimeout(resolve, ms)); });
};
const processTransfer = function (event, redisClient) {
    return __awaiter(this, void 0, void 0, function* () {
        let key = `transfer:${event.blockNumber}:${event.transactionIndex}:${event.logIndex}`;
        // check if this event has been processed
        let processed = yield redisClient.get(key);
        if (processed) {
            winston.info(`This event ${key} has been processed, skip it!`);
            return Promise.resolve();
        }
        const { from, to, tokenId } = event.returnValues;
        winston.info(`Transfer from ${from} to ${to} tokenId ${tokenId}`);
        // TODO: send this information somewhere
    });
};
/**
 * Monitor the contract for events.
 */
const monitor = function (redisClient, web3) {
    return __awaiter(this, void 0, void 0, function* () {
        // get first block from redis, if no value from redis then get from env
        // get current block from network, next time current block will be first block
        let firstBlockNumber = parseInt(yield redisClient.get(lastCheckedBlockKey));
        let currentBlock = yield web3.eth.getBlockNumber();
        if (!firstBlockNumber) {
            firstBlockNumber = process.env.FIRST_BLOCK_NUMBER;
        }
        let options = {
            filter: {},
            fromBlock: firstBlockNumber,
            toBlock: currentBlock
        };
        winston.info(`Monitoring transfer from block ${firstBlockNumber} to block ${currentBlock}`);
        const contract = new web3.eth.Contract(testNetBuild.abi, testNetContractAddress);
        let events = yield contract.getPastEvents('Transfer', options);
        winston.info(`Found ${events.length} events`);
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            yield processTransfer(event, redisClient);
            //await sleep(200)
            //if (i == 1) break
        }
        // save current block to redis
        yield redisClient.set(lastCheckedBlockKey, `${currentBlock}`);
    });
};
const doJob = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let redisClient = createClient();
        yield redisClient.connect();
        const web3 = new Web3(apiUrl);
        console.log(typeof web3);
        // do {
        //     await monitor(redisClient, web3)
        //     await sleep(10000)
        // } while (true)
    });
};
doJob();
// let client: ReturnType<typeof createClient>;
// console.log(client)
//# sourceMappingURL=vsm_testnet_monitor.js.map