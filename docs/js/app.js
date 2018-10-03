'use strict';

let dapp = {
  async init(abi, address) {
    if (!location.hash && window.web3) {
      this.web3 = new Web3(web3.currentProvider);
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider(
        "https://ropsten.infura.io/v3/55571a7e217a4c699cdb7a6346141d20"
      ));
    }

    this.contract = this.web3.eth.contract(abi);
    this.instance = this.contract.at(address);
    let accounts = await this._accounts();
    this.account = accounts[0];
    this.gasPrice = await this._averageGasPrice();
  },

  _estimateGasToRegister(text) {
    return new Promise((resolve, reject) => {
      this.instance.register.estimateGas(text, (err, gas) => {
        if (err) reject(err);
        else resolve(gas);
      });
    });
  },

  _sendTransactionToRegister(text, opts) {
    return new Promise((resolve, reject) => {
      this.instance.register.sendTransaction(text, opts,
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
    });
  },

  _accounts() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err, accounts) => {
        if (err) reject(err);
        else resolve(accounts);
      });
    });
  },

  _averageGasPrice() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getGasPrice((err, price) => {
        if (err) reject(err);
        else resolve(price);
      });
    });
  },

  async register(text) {
    if (!this.account) {
      reject("account not found");
      return;
    }
    let gas = await this._estimateGasToRegister(text);
    return await this._sendTransactionToRegister(text, {
      from: this.account,
      gas: gas + 10000,
      gasPrice: this.gasPrice
    });
  },

  text(key) {
    return new Promise((resolve, reject) => {
      this.instance.getText(key, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  key(text) {
    return new Promise((resolve, reject) => {
      if (!this.account) {
        reject("account not found");
        return;
      }
      this.instance.getKey(text,
        {from: this.account },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
    });
  },

  transactionReceipt(hash, t) {
    return new Promise((resolve, reject) => {
      let fn = () => {
        this.web3.eth.getTransactionReceipt(hash, (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          if (data) {
            resolve(data);
            return;
          }
          setTimeout(fn, t);
        });
      };
      setTimeout(fn, t);
    });
  },
};

let appForm = {
  template: `
  <div>
    <h1> URL SHORTENER </h1>
    <p class="floor long-url">
      http://<input v-model="text" type="url" class="text" placeholder="www.example.com" :disabled="!postable">
    </p>
    <p class="floor">
    <button @click="post"
      class="post pure-button"
      :class="{ pureButtonDisabled: !postable, pureButtonPrimary: postable }">
        Post
    </button>
      <button v-if="key" class="short-url" @click="copy">
        {{ shortUrl }}
      </button>
      <button v-else-if="waiting" class="short-url" disabled>
        Waiting for Transaction Confirmation ...
      </button>
      <button v-else class="short-url" disabled>
        Shortened URL Here
      </button>
    </p>
  </div>
  `,
  props: ["writable"],
  data() {
    return {
      text: "",
      key: "",
      waiting: false
    };
  },

  computed: {
    postable() {
      return this.writable && !this.waiting;
    },
    shortUrl() {
      return "https://" + location.host + location.pathname + "#" + this.key;
    }
  },

  methods: {
    async post() {
      try {
        this.key = await dapp.key(this.text);
        if (this.key) {
          alert("this url already registered")
          return;
        }
        let hash = await dapp.register(this.text);
        this.waiting = true;
        let data = await dapp.transactionReceipt(hash, 100);
        if (data.status === "0x0") {
          alert("transaction failed");
        } else {
          alert("transaction complete")
        }
        this.key = await dapp.key(this.text);
        this.waiting = false;
      } catch (e) {
        console.log(e);
        this.waiting = false;
      }
    },

    copy() {
      navigator.clipboard.writeText(this.shortUrl);
      alert("Copy Shortened URL to Clipboard!");
    }
  },

  watch: {
    text(newVal) {
      if (newVal.startsWith("http://")) {
        this.text = newVal.substring("http://".length);
      } else if (newVal.startsWith("https://")) {
        this.text = newVal.substring("https://".length);
      }
    }
  }
};

let app = new Vue({
  el: "#app",
  components: { appForm },

  data: {
    text: "",
    redirect: false,
    writable: false,
    ready: false
  },

  computed: {
    redirectTo() {
      return "http://" + this.text;
    },
    root() {
      return "https://" + location.host + location.pathname;
    }
  },

  async created() {
    let response = await axios.get("./contract.json");
    await dapp.init(response.data.abi, response.data.address);
    this.writable = !!dapp.account;
    if (location.hash) {
      this.redirect = true;
      let key = location.hash.substring(1);
      this.text = await dapp.text(key);
      if (this.text) location.href = this.redirectTo;
    } else {
      if (!this.writable) {
        setTimeout(() =>
        alert(
          "You need have the MetaMask browser extension installed"
          + " and login to it to register url."),
          100);
      }
    }
    this.ready = true;
  },
});