// import { token_db } from "@/models/token.model";
// import { token_listed } from "@/models/token_listed.model";
// import { template_ver2_db } from "@/models/template2.model";
// import { wallet_db } from "@/models/wallet.model";
// import sequelize from "@/models/index";
// import { QueryTypes } from 'sequelize';
const request = require('request');

// import { Listing_config } from "@/config/listing_config";
// let listing_config: Listing_config = require("@/lib/listing_config.json");
let listing_config = {
    "num_token": 1,   
    "time_scan": 100000, 
    "time_repeat": 5000
}

let purchasing_config = {
    "num_token": 1,   
    "time_scan": 10000, 
    "time_repeat": 5000
}

const contractAddress = '0x3C46A8127083EF698A32daDdB6Bc9b919612F207';
const contractAddress_2 = "0x25BE07479146D3a032D0aCEb06e8a2D8E1AAC762";
const contractAddress_3 = "0x58fF7f8EA3ba7dfe74952A1082cCd8B95aad9a9B";
const operator1 = '0x8c3AE5DbE2900bfBA1Bdb7606D93a96362b0DB33';
const operator1_key = '0x5f00a94a5ea03fe9272e6f04b5c517297bde4d4ead2d7b1af443971dff2049f1';
const operator2 = '0x1e8d23CbEa850a3245ebAaae3468eE8492bda37F';
const operator2_key = '0x7c96459dc302eab99f3bb23aab40486a690b2b603646088785a56a0e26f2f9b9';



require('dotenv').config(); //initialize dotenv
let mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "user1",
  password: "passUser1!",
  database: "stardust"
});


// ########  Listing sub-app
export async function random_choose_token(list_DB:any[],listed:any[],number:number) {
    // var missing = list_DB.filter(function (item:string) { return listed.indexOf(item) < 0; });
    var missing:any = await get_different_elements(list_DB,listed)

    // console.log("MISSING")
    // console.log(missing);
    // if (missing.length >0){
    // var random = Math.floor(Math.random() * missing.length);
    const shuffled = [...missing].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, number);
    // } else{
    //     return []
    // }
}

async function get_different_elements (base_arr:any[],check_arr:any[]){
    return base_arr.filter(function (item:any) { return check_arr.indexOf(item) === -1;});
}

function get_stardust_tokenID_DB (con:any) {
    var data =  new Promise((resolve, reject) => {
        // con.connect(function(err) {
        // if (err) throw err;
        con.query("SELECT stardust_tokenId FROM token_db", function(err:Error, result:any, fiels:any) {
            if (err) throw err;
            resolve(JSON.parse(JSON.stringify(result)));
            // con.end()
        });
        })
    return Promise.resolve(data)
    }

function get_stardust_tokenID_listed (con:any) {
    const data:any =  new Promise((resolve, reject) => {
        // con.connect(function(err) {
        // if (err) throw err;
        con.query("SELECT stardust_tokenId FROM token_listed", function(err:Error, result:any, fiels:any) {
            if (err) throw err;
            resolve(JSON.parse(JSON.stringify(result)));
            // con.end()
        });
        })

    return Promise.resolve(data)
    } 

// arr in target => true
let checker = (arr:any[], target:any[]) => target.every(v => arr.includes(v));

const scan_token = async function () {
    
    var tokenId_db_scan:any = await get_stardust_tokenID_DB(con);
    var tokenId_listed_scan:any = await get_stardust_tokenID_listed(con);

    tokenId_db_scan = tokenId_db_scan.map((singleResult:any) => singleResult.stardust_tokenId);
    tokenId_listed_scan = tokenId_listed_scan.map((singleResult:any) => singleResult.stardust_tokenId);

    token_listed_arr = tokenId_listed_scan
    
    // console.log(tokenId_db_scan)
    // console.log(tokenId_listed_scan)
    // Update list for empty array or token_arr has all token_scan elements
    if (start )  {
        token_DB_arr = await get_different_elements(tokenId_db_scan,token_listed_arr);
        // console.log("SCANNING")
        // console.log(token_DB_arr)
    }
    
    // Merge to compare
    const merge_list = token_DB_arr.concat(token_listed_arr)

    if (tokenId_db_scan.length > merge_list.length){
        const missing_token_arr:any = await get_different_elements(tokenId_db_scan,merge_list);
        token_DB_arr.concat(missing_token_arr)
    } 
    else if (tokenId_db_scan.length < merge_list.length){
        const missing_token_arr:any = await get_different_elements(tokenId_db_scan,merge_list);
        token_DB_arr.filter( function (item:any) {return  missing_token_arr.indexOf(item) === -1;});
    } 
    else if (tokenId_db_scan.length === merge_list.length && !checker(tokenId_db_scan,token_DB_arr)){
        token_DB_arr =tokenId_db_scan;
    }
    console.log("Scanning")
    setTimeout(scan_token ,listing_config.time_scan)

}


const listing_token = async function (stardust_tokenId:Number) {
    const random_price = Math.floor(Math.random() * (10 - 1) + 1) / 1000000;
    let dateTime = new Date()
    new Promise((resolve, reject) => {
        // con.connect(function(err:Error) {
        // if (err) throw err;
            // console.log(`INSET INTO token_listed (stardust_tokenId,prices,time_list) VALUES(${stardust_tokenId},${random_price},"${String(dateTime)}")`)
            con.query(`INSERT INTO token_listed (stardust_tokenId,prices,time_list) VALUES(${stardust_tokenId},${random_price},"${String(dateTime)}")`, function(err:Error, result:any, fiels:any) {
            if (err) throw err;
            resolve(result);
            console.log("Listed success")
            // con.end()
        });
        })
}
// )
// }

var token_DB_arr:any = [];
var token_listed_arr:any = [];
var start = true;

export const listing_auto = async function () {
    if (start) {
        await scan_token()
        start = false
    }
    // console.log(token_listed_arr)
    // console.log(token_DB_arr)
    
    var random = await random_choose_token(token_DB_arr,token_listed_arr,listing_config.num_token)

    // console.log(random)
    // Check valid random
    if (random.length != 0) {
        try {
            for (var i = 0; i< random.length; i++){
                await listing_token(random[i])

                // Update array
                token_listed_arr.push(random[i])
                const index = token_DB_arr.indexOf(random[i]);
                if (index > -1) { // only splice array when item is found
                    token_DB_arr.splice(index, 1); // 2nd parameter means remove one item only
                }
                console.log("Listing")
            }
        } catch (err) {
            console.log(err)
            // continue
        }
    } else {
        console.log("Listing all ready!")    
    }
    setTimeout(listing_auto,listing_config.time_repeat)
}
    // await listing_token(token_Id);

// ############ Purchasing ###########
const list_buyer = [
    {   address:"0xae64B161819f9384b7dDEbE4Fd2633557A70265E",
        privateKey:"0x99b0eb9ce810284e3b7269b2f5fb16679d2062a931a791c191f4035e3f807cd2"},

    {   address:"0x8c3AE5DbE2900bfBA1Bdb7606D93a96362b0DB33",
        privateKey:"0x5f00a94a5ea03fe9272e6f04b5c517297bde4d4ead2d7b1af443971dff2049f1"},
        
    {   address:"0x1e8d23CbEa850a3245ebAaae3468eE8492bda37F",
        privateKey:"0x7c96459dc302eab99f3bb23aab40486a690b2b603646088785a56a0e26f2f9b9"},

    {   address:"0x0812A371BFc6fd1Ce1D9FEbcDd4403aEAEa7eAB6",
        privateKey:"0xb360a05310e2f0d73587e3edd0137286cbe6c64d5c35e551d9d020e4431de4de"},
]


const Web3 = require('web3');

// Chain config
const GAS_LIMIT = 1000000;  // You can change this value if underpriced
const GAS_PRICE = 160000000;  // You can change this value if underpriced

//const serverNode = '3.131.198.45:20002';
const serverNode = '3.12.225.53:10002';
//const serverNode = 'matic-mumbai.chainstacklabs.com';
//const serverNode = 'rpc-mumbai.maticvigil.com';
//const serverNode = 'polygonedge-test.anlab.info';
//const web3 = new Web3(`https://${serverNode}:10002`);
//const web3 = new Web3(`https://${serverNode}`);
const web3 = new Web3(`http://${serverNode}`);


export async function sendETH(senderAddress:string, senderPrivKey:string, to:string, amount:string) {
  const nonce = await web3.eth.getTransactionCount(senderAddress, 'pending');
  const amountToSend = web3.utils.toWei(amount, "ether");
  const transaction = {
    'from': senderAddress,
    'to': to,
    'value': amountToSend,
    'gasPrice': web3.utils.numberToHex(GAS_PRICE),
    'gasLimit': web3.utils.numberToHex(GAS_LIMIT),
    'nonce': web3.utils.numberToHex(nonce),
  };
  const signedTx = await web3.eth.accounts.signTransaction(transaction, senderPrivKey);
  var res;
  try {
    res = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Transfer to ${to} succeed. The hash of your transaction is: `, res.transactionHash);
    return true
    } catch (e) {
    console.log("Something went wrong while submitting your transaction:", e);
    return false
  }
}

var start_purchasing = true

export async function get_wallet_address(playID:string) {
    const data:any =  new Promise((resolve, reject) => {
        // con.connect(function(err) {
        // if (err) throw err;
        con.query(`SELECT address,privateKey FROM wallet WHERE playerId = '${playID}'`, function(err:Error, result:any, fiels:any) {
            if (err) throw err;
            resolve(JSON.parse(JSON.stringify(result)));
            // con.end()
        });
        })

    return Promise.resolve(data)
}

export async function update_token_owner(playID_seller:string,playerId_buyer:string,stardust_tokenId:number) {
    const tokenObjects = {tokenId: Number(stardust_tokenId), amount: "1"}
    
    const transfer_token_api = "/api/token/transfer" ;

    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({
        fromPlayerId: playID_seller,
        toPlayerId: playerId_buyer,
        tokenObjects: tokenObjects
    })
    };
    
    await fetch('https://polygonedge-stardust.anlab.info/api/token/transfer', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

export async function get_playerID_seller(stardust_tokenId:number) {
    const data:any =  new Promise((resolve, reject) => {
        // con.connect(function(err) {
        // if (err) throw err;
        con.query(`SELECT playerId FROM token_db WHERE stardust_tokenId = ${stardust_tokenId}`, function(err:Error, result:any, fiels:any) {
            if (err) throw err;
            resolve(JSON.parse(JSON.stringify(result)));
            // con.end()
        });
        })

    return Promise.resolve(data)
}

export async function get_playerID_buyer(address:string) {
    const data:any =  new Promise((resolve, reject) => {
        // con.connect(function(err) {
        // if (err) throw err;
        con.query(`SELECT playerId FROM wallet WHERE address = '${address}'`, function(err:Error, result:any, fiels:any) {
            if (err) throw err;
            resolve(JSON.parse(JSON.stringify(result)));
            // con.end()
        });
        })

    return Promise.resolve(data)
}

export async function get_token_prices(stardust_tokenId:number) {
    const data:any =  new Promise((resolve, reject) => {
        // con.connect(function(err) {
        // if (err) throw err;
        con.query(`SELECT prices FROM token_listed WHERE stardust_tokenId = ${stardust_tokenId}`, function(err:Error, result:any, fiels:any) {
            if (err) throw err;
            resolve(JSON.parse(JSON.stringify(result)));
            // con.end()
        });
        })

    return Promise.resolve(data)
}

export async function get_token_info(stardust_tokenId:number) {
    const data_token = await get_playerID_seller(stardust_tokenId)
    const player_Id = data_token[0].playerId;
    // console.log("get_playerID_seller ")
    const data_wallet = await get_wallet_address(player_Id)
    const seller_address = data_wallet[0].address;
    const seller_privateKey = data_wallet[0].privateKey;
    // console.log("get_wallet_address ")
    const listed_token_data = await get_token_prices(stardust_tokenId)
    const prices = listed_token_data[0].prices;
    // console.log("get_token_prices ")
    return [player_Id,seller_address,seller_privateKey,prices] as const;
}

export async function purchasing_auto() {

    if (start_purchasing) {
        await scan_token()
    }

    // Choose random buyer
    const shuffled = [...list_buyer].sort(() => 0.5 - Math.random());
    const buyer = list_buyer[0]//shuffled.slice(0, 1)[0];
    const buyer_data = await get_playerID_buyer(buyer.address)
    // console.log(buyer_data)
    const playerId_buyer = buyer_data[0].playerId
    
    // const buyer_address = buyer[0].address;

    //  Choose random token
    const random_listed_token = await random_choose_token(token_listed_arr,[],purchasing_config.num_token)
    // console.log(random_listed_token)
    if (random_listed_token.length != 0) {
        try {
            for (var i = 0; i< random_listed_token.length; i++){
                // Get infor on choosed token
                var [player_Id_seller,seller_address,seller_privateKey,prices] = await get_token_info(random_listed_token[i])
                console.log(`Seller: ${player_Id_seller}`)
                console.log(`Buyer: ${playerId_buyer}`)
                console.log(`Stardust Token ID: ${random_listed_token[i]}`)
                // Send MS token
                const result_sendETH = true// await sendETH(buyer.address,buyer.privateKey,seller_address,String(prices))
                if (result_sendETH){
                // Update database when rtansfer ETH successed 
                    await update_token_owner(player_Id_seller,playerId_buyer,random_listed_token[i])
                    // Payback MS Token
                    // await sendETH(seller_address,seller_privateKey,buyer.address,String(prices))
                }
                else {

                }

            }
        } catch (err) {
            console.log(err)
            // continue
        }
    } else {
        console.log("No listed tokens!")    
    }

    setTimeout(purchasing_auto,purchasing_config.time_repeat)
}



// ########## Run app #########
// scan_token()
// listing_auto()
// listing_token(con,13)
purchasing_auto()