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
  inputsOwner(fromHash, fromIndex) {
    return sdk.getOwner(fromHash, fromIndex);
  },

  //转账交易
  transferTransaction(pri, pub, inputsOwner, outputsOwner, remark) {
    let tx = new txs.TransferTransaction();
    tx.remark = remark;
    tx.time = (new Date()).valueOf();
    tx.inputs = inputsOwner;
    tx.outputs = outputsOwner;
    //计算hash
    let hash = sdk.getTxHash(tx);
    //签名
    sdk.signatureTx(tx, pub, pri);
    return {hash: hash.toString('hex'), signature: tx.txSerialize().toString('hex')}
  }
};
