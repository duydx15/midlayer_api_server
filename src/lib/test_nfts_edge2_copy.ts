const Web3 = require("web3");
import { rejects } from "assert";
import { Mutex } from "async-mutex";
import { resolve } from "path";
import { StringifyOptions } from "querystring";
import { listOperators } from "./operators";
import  BeeQueue = require("bee-queue");
const ethers = require("ethers")
// Chain config
const GAS_LIMIT = 3000000; // You can change this value if underpriced
const GAS_PRICE = 160000000;  // You can change this value if underpriced

//const serverNode = '3.131.198.45:20002';
const serverNode = process.env.ARBITRUM_RPC
const httpsProvider = new ethers.providers.JsonRpcProvider(serverNode);
let feeData:any
const web3 = new Web3(serverNode);
const mutex = new Mutex();
const ERC165Abi: any = [
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const ERC721InterfaceId: string = "0x80ac58cd";
const address = "0xc2cccfd3215a44104d74c5188217574c92d9d745"
const maxTry = 3;

export const sleep = async function (ms:number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Define map for operator
export class CyborgMap extends Map<string, number> {
  constructor() {
    super();
  }

  increment(key: string) {
    if (this.has(key)) {
      this.set(key, (this.get(key) ?? 0) + 1);
      console.log(`Increment nonce ${key} to ${this.get(key) }`)
    }
  }

  decrement(key: string) {
    if (this.has(key)) {
      this.set(key, (this.get(key) ?? 0) - 1);
    }
  }
}
export let nonceGlobal = new CyborgMap()
/* Create and submit a transaction */
export async function sendTransaction_test(
  senderAddress: string,
  senderPrivKey: string,
  txData: string,
  contract_address: string
) {
  await mutex.acquire();
  try {
    const nonce = await web3.eth.getTransactionCount(senderAddress, "pending");
    // console.log(`Got nonce: ${nonce}`);

    const transaction = {
      from: senderAddress,
      to: contract_address,
      value: "0x00",
      gasPrice: web3.utils.numberToHex(GAS_PRICE),
      gasLimit: web3.utils.numberToHex(GAS_LIMIT),
      nonce: web3.utils.numberToHex(nonce),
      data: txData,
    };
    const signedTx = await web3.eth.accounts.signTransaction(transaction,senderPrivKey);
    // console.log(`Got signedTx `);
    let res_: any = {
      status: "false", // initial status
      hash: null, // initial hash
      receipt: null, // initial receipt
      error: null, // initial error
    };
    web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .on("transactionHash", (hash: string) => {
        // The transaction hash is available
        console.log("Transaction hash:", hash);
        res_.hash = hash;
        // res_.status = 'true';
      })
      .on("receipt", (receipt: any) => {
        // The transaction receipt is available
        console.log("Transaction receipt:", receipt);
        res_.status = "true";
        res_.receipt = receipt;
      })
      .on("error", (error: any) => {
        // An error occurred
        console.error("Error sending signed transaction:", error);
        res_.status = "false";
        res_.error = error;
      })
      .then(() => {
        // The transaction was successfully sent to the network
        console.log(`Transaction sent to the network: ${res_.hash}`);
        if (res_.status === "true") {
          return true;
        } else if (res_.status === "false") {
          return false;
        }
      })
      .catch((error: any) => {
        // An error occurred while sending the transaction
        console.error("Error sending signed transaction:", error);
        return false;
      });
    // const res =new Promise((resolve, reject) => {
    //   resolve(web3.eth.sendSignedTransaction(signedTx.rawTransaction))
    // });
    // return res

    // var res =new Promise.resolve(web3.eth.sendSignedTransaction(signedTx.rawTransaction))
    // // console.log("The hash of your transaction is: ", res.transactionHash);
    // // console.log(res);
    // return res
  } finally {
    // console.log("Something went wrong while submitting your transaction:", e);
    // console.log("Error txData: " + txData);
    // return false
    mutex.release();
  }
}

export async function sendTransaction(
  senderAddress: string,
  senderPrivKey: string,
  txData: string,
  contract_address: string,
  queue: BeeQueue
) {
	var mapTrySendTxn = new CyborgMap()
  var suc = false;
  var nonce;
  await mutex.acquire();
  try {
    nonce = nonceGlobal.get(senderAddress);
    console.log(`Nonce: ${nonce}`)
    nonceGlobal.increment(senderAddress);
  } finally {
    mutex.release();
  }

  // console.log(`Got nonce: ${nonce}`);
  // console.log(`Nonce 2: ${nonce}`)
  // const transaction = {
  //   from: senderAddress,
  //   to: contract_address,
  //   value: "0x00",
  //   gasPrice: web3.utils.numberToHex(GAS_PRICE),
  //   gasLimit: web3.utils.numberToHex(GAS_LIMIT),
  //   nonce: web3.utils.numberToHex(nonce),
  //   data: txData,
  // };
  const transaction = {
    from: senderAddress,
    to: contract_address,
    // value: web3.utils.BN(0.2),
    type: 2,
    maxPriorityFeePerGas:feeData["maxPriorityFeePerGas"]._hex, // Recommended maxPriorityFeePerGas
    maxFeePerGas: "0x6553f100",//feeData["maxFeePerGas"],
    gas:  web3.utils.numberToHex(GAS_PRICE),//21000,
    nonce: web3.utils.numberToHex(nonce),
    data:txData
  };

  
  const signedTx = await web3.eth.accounts.signTransaction(
    transaction,
    senderPrivKey
  );
  // console.log(`Got signedTx ${typeof(signedTx)}`);
  
  const job = queue.createJob({transactionData:signedTx})
  await job.save()
  let queue_health = await queue.checkHealth();
  console.log(queue_health)
  mapTrySendTxn.set(signedTx.transactionHash, 0);
  var isSuccess = false;
  var messageTxn;
  while (!suc) {
    mapTrySendTxn.increment(signedTx.transactionHash)
    await sleep(500);
    try {
      var res_ = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      // console.log("The hash of your transaction is: ", res_.transactionHash);
      isSuccess = true;
      messageTxn = res_.transactionHash;
      suc = true;
    } catch (e) {
      // console.log("Something went wrong while submitting your transaction:", e);
      // console.log("Error txData: " + txData);
      isSuccess = false;
      messageTxn = e;
    }
    if (mapTrySendTxn.get(signedTx.transactionHash) == maxTry) break;
  }
  mapTrySendTxn.delete(signedTx.transactionHash)
  await job.remove()
  queue_health = await queue.checkHealth();
  return [isSuccess, messageTxn]

}

/* Query contract's state */
export async function callFunction(callData: string, contract:string) {
  var callObj = {
    to: contract,
    data: callData,
  };
  return await web3.eth.call(callObj);
}

export async function mintERC721(
  operator: string,
  operatorPrivKey: string,
  targetAddress: string,
  tokenId: Number,
  contract_address: string, 
  queue: BeeQueue
) {
  const fn_selector = web3.eth.abi.encodeFunctionSignature(
    "mint(address,uint256)"
  );
  const params_encoded = web3.eth.abi.encodeParameters(
    ["address", "uint256"],
    [targetAddress, tokenId]
  );
  const txData = fn_selector + params_encoded.substring(2); // Remove '0x'

  return await sendTransaction(
    operator,
    operatorPrivKey,
    txData,
    contract_address, 
    queue
  );
}

export async function transferERC721(
  from: string,
  to: string,
  tokenId: Number,
  operator: string,
  operatorPrivKey: string,
  contract_address: string,
  queue: BeeQueue
) {
  const fn_selector = web3.eth.abi.encodeFunctionSignature(
    "transferFrom(address,address,uint256)"
  );
  // console.log(fn_selector)
  const params_encoded = web3.eth.abi.encodeParameters(
    ["address", "address", "uint256"],
    [from, to, tokenId]
  );
  // console.log(params_encoded)
  const txData = fn_selector + params_encoded.substring(2); // Remove '0x'
  // console.log(txData)
  // console.log("Get data success")
  return await sendTransaction(
    operator,
    operatorPrivKey,
    txData,
    contract_address,
    queue
  );

}

export async function burnERC721(
  operator: string,
  operatorPrivKey: string,
  tokenId: Number,
  contract_address: string,
  queue: BeeQueue
) {
  const fn_selector = web3.eth.abi.encodeFunctionSignature("burn(uint256)");
  const params_encoded = web3.eth.abi.encodeParameters(["uint256"], [tokenId]);
  const txData = fn_selector + params_encoded.substring(2); // Remove '0x'

  return await sendTransaction(
    operator,
    operatorPrivKey,
    txData,
    contract_address,
    queue
  );
}

export async function transferERC20(
  from: string,
  to: string,
  amount: Number,
  operator: string,
  operatorPrivKey: string,
  contract_address: string,
  queue: BeeQueue
) {
  const fn_selector = web3.eth.abi.encodeFunctionSignature(
    "transferFrom(address,address,uint256)"
  );
  // console.log(fn_selector)
  const params_encoded = web3.eth.abi.encodeParameters(
    ["address", "address", "uint256"],
    [from, to, amount]
  );
  // console.log(params_encoded)
  const txData = fn_selector + params_encoded.substring(2); // Remove '0x'
  // console.log(txData)
  // console.log("Get data success")
  return await sendTransaction(
    operator,
    operatorPrivKey,
    txData,
    contract_address,
    queue
  );
  // res_send.then(() => {)
  // console.log("The hash of your transaction is: ", res_send)//.transactionHash);
  // console.log(res_send); // 1
  // });
  // console.log(` ${res_send}`)
  //   return true
  // } catch (err){
  //   console.log(`Something went wrong: ${err}`)
  //   return false
  // }
}
export async function mintERC20(
  operator: string,
  operatorPrivKey: string,
  targetAddress: string,
  amount: Number,
  contract_address: string,
  queue: BeeQueue
) {
  const fn_selector = web3.eth.abi.encodeFunctionSignature(
    "mint(address,uint256)"
  );
  const params_encoded = web3.eth.abi.encodeParameters(
    ["address", "uint256"],
    [targetAddress, amount]
  );
  const txData = fn_selector + params_encoded.substring(2); // Remove '0x'

  return await sendTransaction(
    operator,
    operatorPrivKey,
    txData,
    contract_address,
    queue
  );
}

export async function burnERC20(
  targetAddress: string,
  operator: string,
  operatorPrivKey: string,
  amount: Number,
  contract_address: string,
  queue: BeeQueue
) {
  const fn_selector = web3.eth.abi.encodeFunctionSignature("burnFrom(address,uint256)");
  const params_encoded = web3.eth.abi.encodeParameters(["address","uint256"], [targetAddress,amount]);
  const txData = fn_selector + params_encoded.substring(2); // Remove '0x'

  return await sendTransaction(
    operator,
    operatorPrivKey,
    txData,
    contract_address,
    queue
  );
}


export async function ownerOf(tokenId: Number, contract:string) {
  const fn_selector = web3.eth.abi.encodeFunctionSignature("ownerOf(uint256)");
  const params_encoded = web3.eth.abi.encodeParameters(["uint256"], [tokenId]);
  const txData = fn_selector + params_encoded.substring(2); // Remove '0x'

  var res = await callFunction(txData,contract);
  var owner = web3.eth.abi.decodeParameter("address", res);
  console.log("owner of ", tokenId, " is ", owner);
  return owner;
}

export async function checkERC20Contract(contract:string) {
  const fn_selector = web3.eth.abi.encodeFunctionSignature("balanceOf(address)");
  const params_encoded = web3.eth.abi.encodeParameters(["address"], [address]);
  const txData = fn_selector + params_encoded.substring(2); // Remove '0x'

  try{
    var res = await callFunction(txData, contract);
    // var owner = web3.eth.abi.decodeParameter("address", res);
    // console.log(res)
    return true
  } catch (error){
    return false
  }
  // return res;
}

export async function checkERC721Contract( contract:string) {
  const myContract = new web3.eth.Contract(ERC165Abi, contract);
  try{
    const res = await myContract.methods.supportsInterface(ERC721InterfaceId).call()
    // console.log(res)
    return res
  } catch (error){
    // console.log(error)
    return false
  }
  // return res;
}

export async function sendETH(
  senderAddress: string,
  senderPrivKey: string,
  to: string,
  amount: string
) {
  const nonce = await web3.eth.getTransactionCount(senderAddress, "pending");
  const amountToSend = web3.utils.toWei(amount, "ether");
  const transaction = {
    from: senderAddress,
    to: to,
    value: amountToSend,
    gasPrice: "0x00",
    gasLimit: web3.utils.numberToHex(GAS_LIMIT),
    nonce: web3.utils.numberToHex(nonce),
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    transaction,
    senderPrivKey
  );
  var res;
  try {
    res = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(
      `Transfer to ${to} succeed. The hash of your transaction is: `,
      res.transactionHash
    );
  } catch (e) {
    console.log("Something went wrong while submitting your transaction:", e);
  }
}


// var nonceGlobal = {
// };

export async function get_transaction_count() {
  for (var operator_tmp in listOperators){
    const nonce = await web3.eth.getTransactionCount(listOperators[operator_tmp].address, "pending");
    nonceGlobal.set(listOperators[operator_tmp].address,nonce)
  // console.log(`Got current nonce: ${nonce}`);
  }
  console.log("Nonce operators:")
  console.log(nonceGlobal);
  feeData = await httpsProvider.getFeeData();
  // console.log(feeData)
}
// checkERC721Contract("0xFBf5E97c4818c01b7E4c668959E0185d1B5CFF71")