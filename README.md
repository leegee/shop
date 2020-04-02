# Fork of 'Shop'

New features:

* Adds webpack, retains Polymer CLI
* Anchor-based routes
* Splits larger templates into their own files
* Adds optional, easy-to-subclass currency conversion via the [free.currencyconverterapi.com API](https://free.currencyconverterapi.com/), prior to PayPal (which  will do the actual conversion).
* Data source switched to [Google Sheets](https://developers.google.com/sheets/api)
* Added Configuration object
* Makes Google Analytics optional via Config
* Makes sizes and quantities optional (eg for selling paintings)
* The beginning of optional translations via [i18next](https://www.i18next.com/)

## To Do

Outstanding features:

* Integrates code from morbidick's [PayPal checkout](https://github.com/morbidick/paypal-express-checkout/blob/master/paypal.html) (in progress: 70%)
* i18n of static elements and sheet details
* Take sizes/quantities as ranges from Sheet, not just booleans

## Environment and Configuration

Create a `.env` file in the root directory containing:

    googlesheetsapikey
    spreadsheetid
    currencyconverterapikey
    ppac - PayPal account
    ppclientid - PayPal Client ID
    ppsecret - Not used

### Google Sheets

Create a Google Sheet document with one sheet per shop category each sheet with titled columns, whose text is used by the code:

    name title price description image largeImage sizes quantities

The `image` and `largeImage` fields should be URLs. As with the original project, the former image is 250 px square, the latter 532 px square.

The `sizes` and `quantities` columns control whether or not to display those inputs, and are booleans indicated by being blank or having any content.

To get the `spreadsheetid`, in Sheets, select 'Share', and 'get shareable link':

    https://docs.google.com/spreadsheets/d/XXX_XXX_XXX/edit?usp=sharing

your spreadsheet ID is `123_XXX_XXX_XXX`.

Update `src/Config.js` `categoryList` to reflect your Google Sheet, the static being
an array of objects that reflect the individual sheets that detail the categories:

    {
        name: 'sheet-name',                     // Text on the sheet tab
        sheetName: 'sheet-name',                // Text on the sheet tab
        title: 'Category Name',                 // Category title for display
        placeholder: 'data:image/png;base64...' // Lo-res preload Base64 encoded category hero image
        image: 'images/mens_outerwear.png',     // Hi-res final Base64 encoded category hero image
    },

### PayPal Integration

Integrates PayPal using the simplest of all APIs via Morbidick's paypal-button-express.
Settings are in `src/Config.js`.









# Original README

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

