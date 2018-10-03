# URL Shortener on Blockchain
その名の通り、ブロックチェーン上で動くURL短縮ツール

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

migrate contract
```
truffle migrate --network 3
```

extract contract's address and abi to json file
```
node make-contract-json.js
```

and serve files
```
live-server src // or some other server
```