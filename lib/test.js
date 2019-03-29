'use strict';

//import axios from 'axios'
var axios = require('axios');
var nuls = require('./index');
var utils = require('./utils/utils');

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
 * value   8
 * remark  测试转账开始 测试转账开始
 */

var pri = '407d5cd9b5d62ab633c52dfb45542622b06c05004a0314c312390a32b5d06234';
var pub = '032dd7aaff8d2c3ae6597877b67f87702f44f5998b3da4459ddeb6eec8d39171c9';
var fromAddress = 'TTaqFxuD1xc6gpixUiMVQsjMZ5fdYJ2o';
var toAddress = 'TTakMrubBXi998CZgaYdTy2Nrqwd2ptq';
var amount = 800000000; //8
var remark = '测试转账开始 测试转账开始';

//获取input utxo
function getInputUtxo(fromAddress, amount) {
  return axios.post('http://116.62.135.185:8081/', {
    "jsonrpc": "2.0",
    "method": "getUTXOS",
    "params": [fromAddress, amount],
    "id": 1234
  }).then(function (response) {
    return response.data.result;
  }).catch(function (error) {
    console.log(error);
  });
}

//验证交易
function valiTransaction(transactionInfo) {
  return axios.post('http://127.0.0.1:8001/api/accountledger/transaction/valiTransaction', { "txHex": transactionInfo }).then(function (response) {
    return response;
  }).catch(function (error) {
    console.log(error);
  });
}

//广播交易
function broadcast(transactionInfo) {
  return axios.post('http://127.0.0.1:8001/api/accountledger/transaction/broadcast', { txHex: transactionInfo }).then(function (response) {
    return response;
  }).catch(function (error) {
    console.log(error);
  });
}

async function test(pri, pub, fromAddress, toAddress, amount, remark) {
  var inputUtxoInfo = await getInputUtxo(fromAddress, amount);
  var inputOwner = [];
  var totalValue = 0;
  var fee = 100000;
  //判断是否零钱过多
  if (inputUtxoInfo.length >= 6000) {
    console.log("零钱过多不能消费");
  } else {
    //计算手续费 （124 + 50  * inputs.length + 38 * outputs.length + remark.bytes.length ）/1024
    fee = Math.ceil((124 + 50 * inputUtxoInfo.length + 38 * 2 + +utils.stringToByte(remark).length) / 1024) * 100000;
  }
  //计算转账金额需要的inputUtxo
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = inputUtxoInfo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      totalValue = totalValue + item.value;
      inputOwner.push({ owner: item.owner, na: item.value, lockTime: item.lockTime });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var outputOwner = [{ owner: toAddress, na: amount, lockTime: 0 }];
  //计算多余的金额并返回
  if (totalValue - amount > 0) {
    outputOwner.push({ owner: fromAddress, na: totalValue - amount - fee, lockTime: 0 });
  }
  var hashOrSignature = nuls.transferTransaction(pri, pub, inputOwner, outputOwner, remark);
  //验证交易
  var valiTransactions = await valiTransaction(hashOrSignature.signature);
  console.log(valiTransactions.data);
  //广播交易
  var broadcastInfo = await broadcast(hashOrSignature.signature);
  console.log(broadcastInfo.data);
  /* //验证交易成功
   if(valiTransactions.success){
     //广播交易
     const broadcastInfo = await broadcast(hashOrSignature.signature);
     console.log(broadcastInfo.data)
   }else {
     console.log("验证交易失败")
   }*/
}

//测试开始
test(pri, pub, fromAddress, toAddress, amount, remark);