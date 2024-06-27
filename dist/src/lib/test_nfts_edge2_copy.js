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
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareETH = exports.sendETH = exports.ownerOf = exports.burn = exports.transfer = exports.mint = exports.callFunction = exports.sendTransaction = void 0;
const Web3 = require('web3');
// Chain config
const GAS_LIMIT = 1000000; // You can change this value if underpriced
const GAS_PRICE = 160000000; // You can change this value if underpriced
//const serverNode = '3.131.198.45:20002';
const serverNode = '3.12.225.53:10002';
//const serverNode = 'matic-mumbai.chainstacklabs.com';
//const serverNode = 'rpc-mumbai.maticvigil.com';
//const serverNode = 'polygonedge-test.anlab.info';
//const web3 = new Web3(`https://${serverNode}:10002`);
//const web3 = new Web3(`https://${serverNode}`);
const web3 = new Web3(`http://${serverNode}`);
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// Address of target contract
const contractAddress = '0x3C46A8127083EF698A32daDdB6Bc9b919612F207';
//const contractAddress = '0x74e85da26980634311C489944374D03E88944faB';
/* Operator secrets. Please change to your config */
const operator1 = '0x8c3AE5DbE2900bfBA1Bdb7606D93a96362b0DB33';
const operator1_key = '0x5f00a94a5ea03fe9272e6f04b5c517297bde4d4ead2d7b1af443971dff2049f1';
const operator2 = '0x1e8d23CbEa850a3245ebAaae3468eE8492bda37F';
const operator2_key = '0x7c96459dc302eab99f3bb23aab40486a690b2b603646088785a56a0e26f2f9b9';
/* Create and submit a transaction */
function sendTransaction(senderAddress, senderPrivKey, txData, contract_address) {
    return __awaiter(this, void 0, void 0, function* () {
        const nonce = yield web3.eth.getTransactionCount(senderAddress, 'pending');
        //console.log(nonce);
        const transaction = {
            'from': senderAddress,
            'to': contract_address,
            'value': '0x00',
            'gasPrice': web3.utils.numberToHex(GAS_PRICE),
            'gasLimit': web3.utils.numberToHex(GAS_LIMIT),
            'nonce': web3.utils.numberToHex(nonce),
            'data': txData,
        };
        try {
            const signedTx = yield web3.eth.accounts.signTransaction(transaction, senderPrivKey);
            var res;
            res = yield web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log("The hash of your transaction is: ", res.transactionHash);
            console.log(res);
            return true;
        }
        catch (e) {
            console.log("Something went wrong while submitting your transaction:", e);
            console.log("Error txData: " + txData);
            return false;
        }
    });
}
exports.sendTransaction = sendTransaction;
// export async function sendETH(senderAddress, senderPrivKey, to, amount) {
//   const nonce = await web3.eth.getTransactionCount(senderAddress, 'pending');
//   const amountToSend = web3.utils.toWei(amount, "ether");
//   const transaction = {
//     'from': senderAddress,
//     'to': to,
//     'value': amountToSend,
//     'gasPrice': web3.utils.numberToHex(GAS_PRICE),
//     'gasLimit': web3.utils.numberToHex(GAS_LIMIT),
//     'nonce': web3.utils.numberToHex(nonce),
//   };
//   const signedTx = await web3.eth.accounts.signTransaction(transaction, senderPrivKey);
// //console.log(signedTx);
// //return;
//   var res;
//   try {
//     res = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
//     console.log(`Transfer to ${to} succeed. The hash of your transaction is: `, res.transactionHash);
//   } catch (e) {
//     console.log("Something went wrong while submitting your transaction:", e);
//   }
// }
/* Query contract's state */
function callFunction(callData) {
    return __awaiter(this, void 0, void 0, function* () {
        var callObj = {
            to: contractAddress,
            data: callData,
        };
        return yield web3.eth.call(callObj);
    });
}
exports.callFunction = callFunction;
// export async function devMint(operator, operatorPrivKey, targetAddress, tokenIds, data) {
//   const fn_selector = web3.eth.abi.encodeFunctionSignature('devMint(address,uint256[],string[])');
//   const params_encoded = web3.eth.abi.encodeParameters(['address','uint256[]','string[]'], [targetAddress, tokenIds, data]);
//   const txData = fn_selector + params_encoded.substring(2);  // Remove '0x'
//   await sendTransaction(operator, operatorPrivKey, txData);
// }
// export async function createMintTx(sender, sender_privkey, target, tokenId, nonce) {
//   const fn_selector = web3.eth.abi.encodeFunctionSignature('mint(address,uint256,string)');
//   const params_encoded = web3.eth.abi.encodeParameters(['address','uint256','string'], [target, tokenId, '']);
//   const txData = fn_selector + params_encoded.substring(2);  // Remove '0x'
//   const transaction = {
//     'from': sender,
//     'to': contractAddress,
//     'value': '0x00',
//     'gasPrice': web3.utils.numberToHex(GAS_PRICE),
//     'gasLimit': web3.utils.numberToHex(GAS_LIMIT),
//     'nonce': web3.utils.numberToHex(nonce),
//     'data': txData,
//   };
//   return await web3.eth.accounts.signTransaction(transaction, sender_privkey);
// }
// export async function createNftXfer(operator, operator_privkey, from, to, tokenId, nonce) {
//   const fn_selector = web3.eth.abi.encodeFunctionSignature('transferFrom(address,address,uint256)');
//   const params_encoded = web3.eth.abi.encodeParameters(['address','address','uint256'], [from, to, tokenId]);
//   const txData = fn_selector + params_encoded.substring(2);  // Remove '0x'
//   const transaction = {
//     'from': operator,
//     'to': contractAddress,
//     'value': '0x00',
//     'gasPrice': web3.utils.numberToHex(GAS_PRICE),
//     'gasLimit': web3.utils.numberToHex(GAS_LIMIT),
//     'nonce': web3.utils.numberToHex(nonce),
//     'data': txData,
//   };
//   return await web3.eth.accounts.signTransaction(transaction, operator_privkey);
// }
function mint(operator, operatorPrivKey, targetAddress, tokenId, data, contract_address) {
    return __awaiter(this, void 0, void 0, function* () {
        const fn_selector = web3.eth.abi.encodeFunctionSignature('mint(address,uint256,string)');
        const params_encoded = web3.eth.abi.encodeParameters(['address', 'uint256', 'string'], [targetAddress, tokenId, data]);
        const txData = fn_selector + params_encoded.substring(2); // Remove '0x'
        return yield sendTransaction(operator, operatorPrivKey, txData, contract_address);
    });
}
exports.mint = mint;
function transfer(from, to, tokenId, operator, operatorPrivKey, contract_address) {
    return __awaiter(this, void 0, void 0, function* () {
        const fn_selector = web3.eth.abi.encodeFunctionSignature('transferFrom(address,address,uint256)');
        const params_encoded = web3.eth.abi.encodeParameters(['address', 'address', 'uint256'], [from, to, tokenId]);
        const txData = fn_selector + params_encoded.substring(2); // Remove '0x'
        // console.log("Get data success")
        return yield sendTransaction(operator, operatorPrivKey, txData, contract_address);
    });
}
exports.transfer = transfer;
function burn(operator, operatorPrivKey, tokenId, contract_address) {
    return __awaiter(this, void 0, void 0, function* () {
        const fn_selector = web3.eth.abi.encodeFunctionSignature('burn(uint256)');
        const params_encoded = web3.eth.abi.encodeParameters(['uint256'], [tokenId]);
        const txData = fn_selector + params_encoded.substring(2); // Remove '0x'
        return yield sendTransaction(operator, operatorPrivKey, txData, contract_address);
    });
}
exports.burn = burn;
function ownerOf(tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fn_selector = web3.eth.abi.encodeFunctionSignature('ownerOf(uint256)');
        const params_encoded = web3.eth.abi.encodeParameters(['uint256'], [tokenId]);
        const txData = fn_selector + params_encoded.substring(2); // Remove '0x'
        var res = yield callFunction(txData);
        var owner = web3.eth.abi.decodeParameter('address', res);
        console.log('owner of ', tokenId, ' is ', owner);
        return owner;
    });
}
exports.ownerOf = ownerOf;
// export async function tokenURI(tokenId) {
//   const fn_selector = web3.eth.abi.encodeFunctionSignature('tokenURI(uint256)');
//   const params_encoded = web3.eth.abi.encodeParameters(['uint256'], [tokenId]);
//   const txData = fn_selector + params_encoded.substring(2);  // Remove '0x'
//   var res = await callFunction(txData);
//   var uri = web3.utils.hexToAscii(res);
//   console.log(uri);
//   return uri;
// }
function sendETH(senderAddress, senderPrivKey, to, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const nonce = yield web3.eth.getTransactionCount(senderAddress, 'pending');
        const amountToSend = web3.utils.toWei(amount, "ether");
        const transaction = {
            'from': senderAddress,
            'to': to,
            'value': amountToSend,
            'gasPrice': web3.utils.numberToHex(GAS_PRICE),
            'gasLimit': web3.utils.numberToHex(GAS_LIMIT),
            'nonce': web3.utils.numberToHex(nonce),
        };
        const signedTx = yield web3.eth.accounts.signTransaction(transaction, senderPrivKey);
        var res;
        try {
            res = yield web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(`Transfer to ${to} succeed. The hash of your transaction is: `, res.transactionHash);
        }
        catch (e) {
            console.log("Something went wrong while submitting your transaction:", e);
        }
    });
}
exports.sendETH = sendETH;
// export async function testMint(operator:string, operatorPrivKey:string, recipient:string, tokenId:Number) {
//   await mint(operator, operatorPrivKey, recipient, tokenId, '',);
// }
function shareETH() {
    return __awaiter(this, void 0, void 0, function* () {
        //for (var i = 0; i < dummy_accounts.length; i++) {
        //await sendETH(operator1, operator1_key, dummy_accounts[i], '1');
        //var balance = await web3.eth.getBalance(dummy_accounts[i]);
        //balance = web3.utils.fromWei(balance, 'ether')
        //console.log(balance);
        //}
        //var to = '0x3B333e68ac5bdaB09cf1a402e07BBa3041AAf11D';
        var acc = operator1;
        //await sendETH(operator1, operator1_key, to, '100');
        var balance = yield web3.eth.getBalance(acc);
        balance = web3.utils.fromWei(balance, 'ether');
        console.log(balance);
    });
}
exports.shareETH = shareETH;
//shareETH();
// ownerOf(3);
// //tokenURI(1);
// var from = '0x8c3AE5DbE2900bfBA1Bdb7606D93a96362b0DB33';
// var to = '0x9a68d0A0Bc532782229328207B80a4cfD0bf8E80';
// var from = '0xae64B161819f9384b7dDEbE4Fd2633557A70265E'
// transfer(from, to, 3, operator2, operator2_key);
// ownerOf(1);
// // var recipient = from;
//testMint(operator1, operator1_key, to, 1);
//# sourceMappingURL=test_nfts_edge2_copy.js.map