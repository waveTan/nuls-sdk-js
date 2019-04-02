# 注意
nuls-sdk-js 在不断的中....

# Install
```bash
$ npm i nuls-sdk-js
```

# Usage
```js
const nuls = require('./index');

//创建地址
let passWord = "";
const newAddress = nuls.newAddress(passWord);
console.log(newAddress);

//导入地址
const key ="";
const importAddress = nuls.importByKey(key);
console.log(importAddress);

//转账功能

let pri = ''; //转出地址私钥
let pub = ''; //转出地址公钥
let fromAddress = ''; //转出地址
let toAddress = '';   //转入地址
let amount = ;        //转出金额右移八位
let remark = '';      //交易备注

//转账功能 trustUrl
async function transfer(pri, pub, fromAddress, toAddress, amount, remark) {
  const inputUtxoInfo = await nuls.getInputUtxo(fromAddress, amount);
  let inputOwner = [];
  let totalValue = 0;
  let fee = 100000;
  //判断是否零钱过多
  if (inputUtxoInfo.length >= 6000) {
    return {success: false, data: "Too much change to consume"}
  } else {
    //计算手续费 （124 + 50  * inputs.length + 38 * outputs.length + remark.bytes.length ）/1024
    fee = Math.ceil((124 + 50 * inputUtxoInfo.length + 38 * 2 + +utils.stringToByte(remark).length) / 1024) * 100000;
  }
  //计算转账金额需要的inputUtxo
  for (let item of inputUtxoInfo) {
    totalValue = totalValue + item.value;
    inputOwner.push({owner: item.owner, na: item.value, lockTime: item.lockTime});
  }
  let outputOwner = [
    {owner: toAddress, na: amount, lockTime: 0}
  ];
  //计算多余的金额并返回
  if (totalValue - amount > 0) {
    outputOwner.push({owner: fromAddress, na: totalValue - amount - fee, lockTime: 0})
  }
  let hashOrSignature = nuls.transferTransaction(pri, pub, inputOwner, outputOwner, remark);
  //验证交易
  let valiTransactions = await nuls.valiTransaction(hashOrSignature.signature);
  //验证交易成功
  if (valiTransactions.data.success) {
    //广播交易
    const broadcastInfo = await nuls.broadcast(hashOrSignature.signature);
    return broadcastInfo.data
  } else {
    return {success: false, data: "verify transaction failure"}
  }
}

//测试转账交易
transfer(pri, pub, fromAddress, toAddress, amount, remark).then((response) => {
  console.log(response)
}).catch((error) => {
  console.log(error)
});



```



