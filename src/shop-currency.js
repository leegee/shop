import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Config } from './Config';

export class ShopCurrency extends PolymerElement {
    static get template() {
        return html`<span class="currency">[[formatted]]</span>`;
    }

    static get is() { return 'shop-currency'; }

    static get properties() {
        return {
            char: {
                type: String,
                // Set the initial value of the symbol to that used in the data source and ignored in the conversion, as is a factor of 1
                value: Config.defaultSymbol.char,
                observer: 'symbolChanged'
            },
            value: {
                type: Number,
                observer: 'valueChanged'
            },
            formatted: {
                type: String,
                value: '-'
            }
        }
    }

    static setDefaultRates() {
        const rv = {};
        Object.keys(ShopCurrency.symbols).forEach(char => rv[char] = 0);
        rv[Config.defaultSymbol.char] = 1;
        return rv;
    };
    
    static getRates() {
        const url = 'http://free.currencyconverterapi.com/api/v5/convert?compact=y&q=';
        const promises = [];
        Object.keys(ShopCurrency.symbols).filter(char => char !== Config.defaultSymbol.char).forEach(char => {
            const key = ShopCurrency.symbols[char] + '_' + Config.defaultSymbol.symbol; 
            const promise = fetch(url + key)
                .then(res => {
                    return res.json();
                })
                .then(json => {
                    ShopCurrency.rates[char] = json[key].val;
                });
            promises.push(promise);
        });
        return Promise.all(promises).then(() => {
            console.log(ShopCurrency.rates);
            ShopCurrency.ready = true;
            ShopCurrency.gotCurrencies = true;
        });
    }

    connectedCallback() {
        document.addEventListener('currency-changed', (e) => {
            this.char = e.detail.char;
        })
    }

    valueChanged() {
        this._format();
    }

    symbolChanged(symbol) {
        if (Object.keys(ShopCurrency.symbols).indexOf(this.char) == -1) {
            throw new TypeError('No such currency symbol as "' + this.char + '"');
        }
        this._format();
    }

    _format() {
        this.formatted = isNaN(this.value) ? '-' : (this.value * ShopCurrency.rates[this.char]).toLocaleString(undefined, {
            style: 'currency',
            currency: ShopCurrency.symbols[this.char],
            currencyDisplay: 'symbol'
        });
    }
}

ShopCurrency.ready = false;
ShopCurrency.gotCurrencies = false;
ShopCurrency.instance = null;
ShopCurrency.symbols = Config.chars2symbols;
// Factors by which to multiply the values in the data source
ShopCurrency.rates = ShopCurrency.setDefaultRates();

customElements.define(ShopCurrency.is, ShopCurrency);

if (!ShopCurrency.gotCurrencies) {
    ShopCurrency.getRates();
}
