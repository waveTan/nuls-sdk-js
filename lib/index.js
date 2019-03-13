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
  inputsOwner: function inputsOwner() {
    var owner = sdk.getOwner('00208c0e7500786f303b40b8dda8fe1e58d0bdbbebd89126b052f5f7f3019b7a7037', 15);
    console.log(owner);
  },


  //转账交易
  transferTransaction: function transferTransaction() {
    var tx = new TransferTransaction();
    tx.remark = 'for test';
    tx.time = 123456789;
    tx.inputs = [{ owner: '9e9644d3be6c9f90947580ad74641e24f4d0f791c6182c06ec76e270f703feb801', na: 100000000, lockTime: 0 }];
    tx.outputs = [{ owner: "Nse2ACrBkXJiq5KoFCJCb5NaJT9bk4nZ", na: 99000000, lockTime: 0 }];
    //计算hash
    var hash = sdk.getTxHash(tx);
    console.log(hash.toString('hex'));
    //签名
    //sdk.signatureTx(tx, pub, pri);
  }
};