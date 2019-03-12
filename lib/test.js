'use strict';

let _createClass = function () { function defineProperties(target, props) { for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** 测试类 */
let HelloWorld = function () {
  function HelloWorld() {
    _classCallCheck(this, HelloWorld);
  }

  _createClass(HelloWorld, [{
    key: 'say',

    /**
     * 在页面中显示hello world
     */
    value: function say() {
      let div = document.createElement('div');
      div.innerHTML = 'hello world';
      document.body.appendChild(div);
    }
  }]);

  return HelloWorld;
}();

/*const nuls = require("../index.js");

const newaddress = nuls.newAccount();
console.log(newaddress);*/

/*var pir = '571b7943bea6898f4bd6a4e6808ab7a9a2c10df9f118331b2cf3d7630d6a17153321e0223a53152cac0bc75232ea8a72';
var passWord = 'nuls123456';
const importAddress = nuls.importAccount(passWord,pir);
console.log(importAddress);*/
/*const TransferSignatureTx = nuls.Transfer(pub, pri, utxo, toAddresss, value, remarks);*/
