const sdk = require('./api/sdk');
const txs = require('./model/txs');

module.exports = {

  //生成地址
  newAddress(passWord) {
    let addressInfo = {};
    if (passWord) {

    } else {
      addressInfo = sdk.newEcKey(passWord);
      addressInfo.address = sdk.getStringAddress(addressInfo.pri, addressInfo.pub);
    }
    return addressInfo
  },

  //私钥导入
  importByKey(pri) {
    let addressInfo = {};
    addressInfo.pri = pri;
    addressInfo.address = sdk.getStringAddress(pri);
    addressInfo.pub = sdk.getPub(pri);
    return addressInfo
  },

  //拼装inputs owne
  inputsOwner(){
    let owner = sdk.getOwner('00208c0e7500786f303b40b8dda8fe1e58d0bdbbebd89126b052f5f7f3019b7a7037',15);
    console.log(owner)
  },

  //转账交易
  transferTransaction() {
    let tx = new TransferTransaction();
    tx.remark = 'for test';
    tx.time = 123456789;
    tx.inputs = [
      {owner: '9e9644d3be6c9f90947580ad74641e24f4d0f791c6182c06ec76e270f703feb801', na: 100000000, lockTime: 0}
    ];
    tx.outputs = [
      {owner: "Nse2ACrBkXJiq5KoFCJCb5NaJT9bk4nZ", na: 99000000, lockTime: 0}
    ];
    //计算hash
    let hash = sdk.getTxHash(tx);
    console.log(hash.toString('hex'));
    //签名
    sdk.signatureTx(tx, pub, pri);
  }


};
