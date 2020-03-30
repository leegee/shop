# Fork of 'Shop'

New features:

* Adds webpack, retains Polymer CLI
* Splits larger templates into their own files
* Adds Translation via [i18next](https://www.i18next.com/)
* Adds currency conversion via the [free.currencyconverterapi.com API](https://free.currencyconverterapi.com/), prior to PayPal (which  will do the actual conversion).
* Anchor-based routes
* Data source switched to [Google Sheets](https://developers.google.com/sheets/api)
* Added Configuration object

## To Do

Outstanding features:

* PayPal checkout (in progress: 50%)

## Environment

Create a `.env` file in the root directory with the following keys:

    googlesheetsapikey
    currencyconverterapikey

Create a Google Sheet: one sheet per shop category each sheet with columns:

    name title category price description image largeImage

Update `src/Config.js`.
****
## Original README

### SHOP

Shop is a sample e-commerce [Progressive Web App](https://developers.google.com/web/progressive-web-apps/).

![shop screenshot](https://user-images.githubusercontent.com/116360/39545341-c50a9184-4e05-11e8-88e0-0e1f3fa4834b.png)

### Features/highlights

- a sample e-commerce shopping site
- pattern for a real-life shopping cart and store checkout flow
- pattern for using custom announcers for accessibility

### Setup
```bash
$ git clone https://github.com/Polymer/shop.git
$ cd shop
$ npm i
$ npm start
```

### Build
```bash
$ npm run build
```

### Test the build
To test prpl-server build:
```bash
$ npm run serve:prpl-server
```
To test static build:
```bash
$ npm run serve:static
```

### Deploying

Our [production deployment of SHOP](https://shop.polymer-project.org/) is hosted on App Engine with Node.js. It can be deployed with [the same steps as PWA Starter Kit](https://polymer.github.io/pwa-starter-kit/building-and-deploying/#deploying-prpl-server).

