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
                // Set the initial value of the symbol to that used in the data source
                // and ignored in the conversion, as is a factor of 1
                value: Config.defaultSymbol.char,
                observer: 'symbolChanged'
            },
            symbol: {
                type: String,
                notify: true,
                reflectToAttribute: true,
                computed: '_computeSymbol()'
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
        const promises = [];
        Object.keys(ShopCurrency.symbols).filter(char => char !== Config.defaultSymbol.char).forEach(char => {
            const key = ShopCurrency.symbols[char] + '_' + Config.defaultSymbol.symbol;
            const promise = fetch(Config.currencyConvertorURL + key, {
                mode: 'no-cors',
            })
                .then(res => {
                    return res.json();
                })
                .then(json => {
                    ShopCurrency.rates[char] = json[key].val;
                });
            promises.push(promise);
        });
        return Promise.all(promises).then(() => {
            console.log('ShopCurrency.rates', ShopCurrency.rates);
            ShopCurrency.ready = true;
            ShopCurrency.gotCurrencies = true;
        });
    }

    connectedCallback() {
        document.addEventListener('currency-changed', (e) => {
            this.char = e.detail.char;
        })
    }

    _computeSymbol() {
        return ShopCurrency.symbols[this.char];
    }

    valueChanged() {
        this._format();
    }

    symbolChanged(symbol) {
        if (Object.keys(ShopCurrency.symbols).indexOf(this.char) == -1) {
            throw new TypeError('No such currency symbol as "' + this.char + '"');
        }
        this._format();
        document.dispatchEvent(
            new CustomEvent('currency-set', {
                detail: {
                    currency: this.symbol
                }
            }
            )
        );
    }

    _format() {
        this.formatted = isNaN(this.value) ? '-' : (this.value * ShopCurrency.rates[this.char]).toLocaleString(undefined, {
            style: 'currency',
            currency: ShopCurrency.symbols[this.char],
            currencyDisplay: 'symbol'
        });
    }
}

if (Config.currencyConvertorURL) {
    ShopCurrency.ready = false;
    ShopCurrency.gotCurrencies = false;
    ShopCurrency.instance = null;
    ShopCurrency.symbols = Config.chars2symbols;

    ShopCurrency.symbolsForUser = Object.keys(ShopCurrency.symbols);

    // Factors by which to multiply the values in the data source
    ShopCurrency.rates = ShopCurrency.setDefaultRates();

    customElements.define(ShopCurrency.is, ShopCurrency);

    if (!ShopCurrency.gotCurrencies) {
        ShopCurrency.getRates();
    }
}
else {
    ShopCurrency.ready = true;
    ShopCurrency.gotCurrencies = true;
    ShopCurrency.instance = null;
    ShopCurrency.symbols = Config.chars2symbols;

    ShopCurrency.symbolsForUser = Object.keys(ShopCurrency.symbols);

    // Factors by which to multiply the values in the data source
    ShopCurrency.rates = ShopCurrency.setDefaultRates();

    customElements.define(ShopCurrency.is, ShopCurrency);
}
