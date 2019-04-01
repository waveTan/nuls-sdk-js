'use strict';

var sdk = require('./api/sdk');
var txs = require('./model/txs');

module.exports = {

  //生成地址
  newAddress: function newAddress(passWord) {
    var addressInfo = {};
    if (passWord) {} else {
      addressInfo = sdk.newEcKey(passWord);
      addressInfo.address = sdk.getStringAddress(addressInfo.pri, addressInfo.pub);
    }
    return addressInfo;
  },


  //私钥导入
  importByKey: function importByKey(pri) {
    var addressInfo = {};
    addressInfo.pri = pri;
    addressInfo.address = sdk.getStringAddress(pri);
    addressInfo.pub = sdk.getPub(pri);
    return addressInfo;
  },


  //拼装inputs owne
  inputsOwner: function inputsOwner(fromHash, fromIndex) {
    return sdk.getOwner(fromHash, fromIndex);
  },


  //转账交易
  transferTransaction: function transferTransaction(pri, pub, inputsOwner, outputsOwner, remark) {
    var tx = new txs.TransferTransaction();
    tx.remark = remark;
    tx.time = new Date().valueOf();
    tx.inputs = inputsOwner;
    tx.outputs = outputsOwner;
    //计算hash
    var hash = sdk.getTxHash(tx);
    //签名
    sdk.signatureTx(tx, pub, pri);
    return { hash: hash.toString('hex'), signature: tx.txSerialize().toString('hex') };
  }
};