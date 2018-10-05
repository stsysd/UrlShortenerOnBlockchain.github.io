# URL Shortener on Blockchain
その名の通り、ブロックチェーン上で動くURL短縮ツール

# Demo
- URL登録(要MetaMask)[https://urlshr.tk]
- 短縮URL[https://urlshr.tk/#TCScAkgf]

## Description
EthereumのContractにURLを送ると、ハッシュ関数から[a-zA-Z0-9]からなる8文字のkeyを生成してmappingに登録する。短縮URLはルートに"#[key]"を加えたものになる。

短縮URLにアクセスがあった場合は、Contractにkeyを送って元のURLを受け取り、javascriptでそのページにジャンプする。

現在のところtestnet(ropsten)でのみ動作確認済み。

# Requirement
- truffle@4.1.14
- truffle-hdwallet-provider@0.0.6
- MetaMask@4.11.1 (for registraction)

# Using Libraries
- [web3.js](https://github.com/ethereum/web3.js/)
- [Vue.js](https://jp.vuejs.org/index.html)
- [axios](https://github.com/axios/axios)
- [Pure.css](https://purecss.io/)

## Setup
install truffle-hdwallet-provider
```
npm install truffle-hdwallet-provider
```

migrate contract (to require MetaMask nmemonic of "../nmemonic.txt")
```
npm run migrate
```

and serve files in local
```
npm run serve // to serve "./docs" at http://127.0.0.1:8080
```