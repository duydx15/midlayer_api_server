/**
 * Script to monitor vsm founder nft transfer.
 * 
 */
require('dotenv').config(); //initialize dotenv
const { createClient } = require('redis')
const Web3 = require('web3')
const fs = require('fs')
const winston = require('./utils').winston;

const apiUrl = 'https://polygonedge-test.anlab.info'
const testNetContractAddress = '0x3C46A8127083EF698A32daDdB6Bc9b919612F207'
const testNetBuild = JSON.parse(fs.readFileSync('./build/contracts/TestPassEdge.json', 'utf8'));
const lastCheckedBlockKey = `${testNetContractAddress}:lastCheckedBlock`

const sleep = async function(ms:Number) { return new Promise(resolve => setTimeout(resolve, ms)); }

const processTransfer = async function(event, redisClient) {
    let key = `transfer:${event.blockNumber}:${event.transactionIndex}:${event.logIndex}`

    // check if this event has been processed
    let processed = await redisClient.get(key)
    if (processed) {
        winston.info(`This event ${key} has been processed, skip it!`)
        return Promise.resolve()
    }

    const { from, to, tokenId } = event.returnValues;
    winston.info(`Transfer from ${from} to ${to} tokenId ${tokenId}`)

    // TODO: send this information somewhere
}

/**
 * Monitor the contract for events.
 */
const monitor = async function(redisClient, web3) {
    // get first block from redis, if no value from redis then get from env
    // get current block from network, next time current block will be first block
    let firstBlockNumber = parseInt(await redisClient.get(lastCheckedBlockKey))
    let currentBlock = await web3.eth.getBlockNumber()
    if (!firstBlockNumber) {
        firstBlockNumber = process.env.FIRST_BLOCK_NUMBER
    }

    let options = {
        filter: {
        },
        fromBlock: firstBlockNumber,
        toBlock: currentBlock
    };
    winston.info(`Monitoring transfer from block ${firstBlockNumber} to block ${currentBlock}`)

    const contract = new web3.eth.Contract(testNetBuild.abi, testNetContractAddress);
    let events = await contract.getPastEvents('Transfer', options)
    winston.info(`Found ${events.length} events`)

    for (let i = 0; i < events.length; i++) {
        let event = events[i]
        await processTransfer(event, redisClient)
        //await sleep(200)
        //if (i == 1) break
    }

    // save current block to redis
    await redisClient.set(lastCheckedBlockKey, `${currentBlock}`)
}

const doJob = async function() {
    let redisClient = createClient()
    await redisClient.connect()
    const web3 = new Web3(apiUrl)
    console.log(typeof web3)
    // do {
    //     await monitor(redisClient, web3)
    //     await sleep(10000)
    // } while (true)
}

doJob()


// let client: ReturnType<typeof createClient>;
// console.log(client)
