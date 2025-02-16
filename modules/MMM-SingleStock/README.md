# MMM-SingleStock

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) to display a single stock price without any fancy animation.

## Features

By default this module displays the symbol and the current price of the configured stock:

![](https://raw.githubusercontent.com/balassy/MMM-SingleStock/master/doc/screenshot-default.png)

You can configure the module to display the full name of the company instead of the stock symbol:

![](https://raw.githubusercontent.com/balassy/MMM-SingleStock/master/doc/screenshot-companyname.png)

If you wish, you can completely remove the prefix, and display only the price value:

![](https://raw.githubusercontent.com/balassy/MMM-SingleStock/master/doc/screenshot-none.png)

You can even configure any custom prefix, for example a dollar sign:

![](https://raw.githubusercontent.com/balassy/MMM-SingleStock/master/doc/screenshot-customprefix.png)

The second line of the module displays the change of the price which can be hidden if you prefer:

![](https://raw.githubusercontent.com/balassy/MMM-SingleStock/master/doc/screenshot-nochange.png)

This module is capable to display only a single stock price. If you would like to see the price of more stocks on your mirror, add this module multiple times.

For updates, please check the [CHANGELOG](https://github.com/balassy/MMM-SingleStock/blob/master/CHANGELOG.md).

## Using the module

To use this module follow these steps:

1. Clone this repository to the `modules` folder of your MagicMirror:

```bash
git clone https://github.com/balassy/MMM-SingleStock.git
```

2. Add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
  modules: [
    {
      module: 'MMM-SingleStock',
      position: 'top_right',
      config: {
        stockSymbol: 'GOOG',
        updateInterval: 3600000, // 1 hour in milliseconds
        showChange: true,        // false | true
        label: 'symbol'          // 'symbol' | 'companyName' | 'none' | any string
      }
    }
  ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `stockSymbol`    | **REQUIRED** The symbol of the stock of what the value should be displayed in this module. <br><br> **Type:** `string` <br>**Default value:** `GOOG`
| `updateInterval` | *Optional* The frequency of when the module should query the current price of the stock. <br><br>**Type:** `int` (milliseconds) <br>**Default value:** `3600000` milliseconds (1 hour)
| `showChange`     | *Optional* Determines whether the price difference should be also displayed. <br><br>**Type:** `boolean` <br>**Default value:** `true` (yes, the price difference is displayed)
| `label`          | *Optional* Determines what prefix should be prepended to the price. <br><br>**Type:** `string` <br>**Possible values:** <br>`symbol`: The acronym of the stock (e.g. `GOOG`) is displayed before the price.<br>`companyName`: The full name of the company (e.g. `Alphabet Inc.`) is displayed before the price.<br>`none`: Nothing is displayed before the price, only the price is shown.<br>Any other string is displayed as is, e.g. set `$` to display a dollar sign before the price number.<br>**Default value:** `symbol` (the acronym of the stock is displayed before the price)

## How it works

This module periodically sends requests from the browser window of the MagicMirror Electron application to the [IEXtrading Service](https://iextrading.com/developer/). The IEX API is free, and it does NOT require any login or API key.

You can see an example by visiting this URL: https://api.iextrading.com/1.0/stock/GOOG/quote

## Localization

Currently this module supports English (`en`) and Hungarian (`hu`) languages. The language can be specified in the global `language` setting in the `config.js` file.

Want to see more languages? Please contribute!

## Contribution

Although for operation this module does not depend on any other module, if you would like to contribute to the codebase, please use the preconfigured linters to analyze the source code before sending a pull request. To run the linters follow these steps:

1. Install developer dependencies:

```bash
npm install
```

2. Install Grunt:

```bash
npm install -g grunt
```

3. Use Grunt to run all linters:

```bash
grunt
```

## Got feedback?

Your feedback is more than welcome, please send your suggestions, feature requests or bug reports as [Github issues](https://github.com/balassy/MMM-SingleStock/issues).

## Acknowledments

Many thanks to [Michael Teeuw](https://github.com/MichMich) for creating and maintaining the [MagicMirror²](https://github.com/MichMich/MagicMirror/) project fully open source.

Thanks to [alexyak](https://github.com/alexyak) for calling my attention to the IEX API.

Thanks to [Rodrigo Ramírez Norambuena](https://github.com/roramirez) for creating the [MagicMirror-Module-Template](https://github.com/roramirez/MagicMirror-Module-Template).


## About the author

This project is created and maintaned by [György Balássy](https://www.linkedin.com/in/balassy).
