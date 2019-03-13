//import axios from 'axios'
const axios = require('axios');
const nuls = require('./index');


//创建地址
/*let passWord = '';
const newAddress = nuls.newAddress(passWord);
console.log(newAddress);*/

//key:2de32308846652eeeaf68e23ef586aecb82f0459d4b520dddf13c7542c2b8f83
//pub:02a4859a56aa2d4277b1f8a9243a764d9adf8ad5965b772c9278afbed8be059e6b
//pri:02ecb18a38f396e911a5077794dac1e2d53da326a3d91b2247240ff84a40e0bf701bc8257f0d174b55f920c8a70a73f8
//address:Nsdtr9G1PpZMyi7G2TafXoHYUfBkaFKz
//导入地址
/*const key ="407d5cd9b5d62ab633c52dfb45542622b06c05004a0314c312390a32b5d06234";
const importAddress = nuls.importByKey(key);
console.log(importAddress);*/

/**
 * from    TTaqFxuD1xc6gpixUiMVQsjMZ5fdYJ2o
 * to      TTakMrubBXi998CZgaYdTy2Nrqwd2ptq
 * value   0.8
 * remark  test transfer
 */

let pri = '407d5cd9b5d62ab633c52dfb45542622b06c05004a0314c312390a32b5d06234';
let pub = '032dd7aaff8d2c3ae6597877b67f87702f44f5998b3da4459ddeb6eec8d39171c9';
let fromAddress = 'TTaqFxuD1xc6gpixUiMVQsjMZ5fdYJ2o';
let toAddress = 'TTakMrubBXi998CZgaYdTy2Nrqwd2ptq';
let amount = '80000000';
let remark = 'test transfer';

//获取input utxo
function getInputUtxo(fromAddress, amount) {
  return axios.post('http://116.62.135.185:8081/', {
    "jsonrpc": "2.0",
    "method": "getUTXO",
    "params": [fromAddress, amount],
    "id": 1234
  })
    .then(function (response) {
      return response.data.result;
    })
    .catch(function (error) {
      console.log(error);
    });
}

//广播交易
function broadcast(transactionInfo) {
  return axios.post('http://127.0.0.1:8001/api/accountledger/transaction/broadcast', {transactionInfo})
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}


async function test(pri, pub, fromAddress, toAddress, amount, remark) {
  const inputUtxoInfo = await getInputUtxo(fromAddress, amount);
  let inputOwner = [];
  let totalValue = 0;
  //循环放入
  for (let item of inputUtxoInfo) {
    totalValue = totalValue + item.value;
    inputOwner.push({owner: nuls.inputsOwner(item.fromHash, item.fromIndex), na: item.value, lockTime: 0})
  }
  let outputOwner = [
    {owner: toAddress, na: amount, lockTime: 0}
  ];
  //计算多余的金额并返回
  if (totalValue - 800000000 > 0) {
    outputOwner.push({owner: fromAddress, na: totalValue - 800000000 - 1000000, lockTime: 0})
  }
/*  console.log(inputOwner);
  console.log(outputOwner);*/
  let hashOrSignature = nuls.transferTransaction(pri, pub, inputOwner, outputOwner, remark);
  console.log(hashOrSignature);
  console.log("*****************************************************");
  /*const broadcastInfo = await broadcast(hashOrSignature.signature);
  console.log(broadcastInfo)*/
}

test(pri, pub, fromAddress, toAddress, amount, remark);


//获取inputs owne
//nuls.inputsOwner();

//交易签名
//nuls.transferTransaction();


//获取UTXO

//交易签名

//广播交易
