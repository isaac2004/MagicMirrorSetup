/* global Module, Log */

/* Magic Mirror Module: MMM-SingleStock (https://github.com/balassy/MMM-SingleStock)
 * By György Balássy (https://www.linkedin.com/in/balassy)
 * MIT Licensed.
 */
Module.register("MMM-SingleStock", {
  defaults: {
    stockSymbol: "GOOG",
    token: "pk_1b2d19d779fa4d488d4dfdf0b839d39a",
    updateInterval: 3600000,
    showChange: true
  },
  stock: {},
  allStocks: [],
  requiresVersion: "2.1.0",

  getTranslations() {
    return {
      en: "translations/en.json",
      hu: "translations/hu.json"
    };
  },

  start() {
    const self = this;
    this.viewModel = null;
    this.hasData = false;
    this._getStocks();

    setInterval(() => {
      self._getStocks();
      self._assignStock();
    }, this.config.updateInterval);
  },

  notificationReceived: function(notification, payload) {
    if (notification === "HIDE_STOCK") {
      this.hide(1000);
      this.updateDom(300);
    } else if (notification === "SHOW_STOCK") {
      this._assignStock(payload);
      this.show(1000);
      this.updateDom(300);
    }
  },

  getDom() {
    const wrapper = document.createElement("div");

    if (this.viewModel) {
      const priceEl = document.createElement("div");
      priceEl.innerHTML = `${this.viewModel.name}<br />${
        this.viewModel.symbol
      } ${this.viewModel.price}`;
      wrapper.appendChild(priceEl);

      if (this.config.showChange) {
        const changeEl = document.createElement("div");
        changeEl.classList = "dimmed small";
        changeEl.innerHTML = ` (${this.viewModel.change})`;
        wrapper.appendChild(changeEl);
      }
    } else {
      const loadingEl = document.createElement("span");
      loadingEl.innerHTML = this.translate("LOADING");
      loadingEl.classList = "dimmed small";
      wrapper.appendChild(loadingEl);
    }

    return wrapper;
  },

  _getStocks() {
    const self = this;

    const url = `https://cloud.iexapis.com/stable/ref-data/symbols?token=${
      self.config.token
    }`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function onReadyStateChange() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          self.allStocks = JSON.parse(this.response);
          self._assignStock(self.config.stockSymbol);
        } else {
          Log.error(
            self.name,
            `MMM-SingleStock: Failed to load data. XHR status: ${this.status}`
          );
        }
      }
    };

    xhr.send();
  },

  _assignStock(responseBody) {
    if (responseBody != undefined) {
      for (var i = 0; i < this.allStocks.length; i++) {
        if (
          this.allStocks[i].symbol == responseBody.toUpperCase() ||
          this.allStocks[i].name.indexOf(responseBody) > -1
        ) {
          this.stock = this.allStocks[i];
          break;
        } else {
          this.stock.symbol = this.config.stockSymbol;
        }
      }
    }
    const self = this;

    const url = `https://cloud.iexapis.com/stable/stock/${
      this.stock.symbol
    }/quote?token=${self.config.token}`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function onReadyStateChange() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          self._processResponse(this.response);
        } else {
          Log.error(
            self.name,
            `MMM-SingleStock: Failed to load data. XHR status: ${this.status}`
          );
        }
      }
    };

    xhr.send();
  },

  _processResponse(responseBody) {
    const response = JSON.parse(responseBody);

    this.viewModel = {
      symbol: response.symbol,
      name: response.companyName,
      price: response.latestPrice,
      change: response.change > 0 ? `+${response.change}` : `${response.change}`
    };

    if (!this.hasData) {
      this.updateDom();
    }

    this.hasData = true;
    this.updateDom();
  }
});
