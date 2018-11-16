import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

export class ShopCurrency extends PolymerElement {
    static get template() {
        return html`<span class="currency">[[formatted]]</span>`;
    }

    static get is() { return 'shop-currency'; }

    static get properties() {
        return {
            symbol: {
                type: String,
                // Set the initial value of the symbol to that used in the data source and ignored in the conversion, as is a factor of 1
                value: 'HUF',
                observer: 'symbolChanged'
            },
            value: {
                type: Number,
                observer: 'valueChanged'
            },
            formatted: {
                type: String,
                value: 'foo'
            }
        }
    }

    static getRates() {
        const url = 'http://free.currencyconverterapi.com/api/v5/convert?compact=y&q=';
        const promises = [];
        Object.keys(ShopCurrency.symbols).filter(symbol => symbol !== 'HUF').forEach(symbol => {
            const key = ShopCurrency.symbols[symbol] + '_HUF';
            const promise = fetch(url + key)
                .then(res => {
                    return res.json();
                })
                .then(json => {
                    ShopCurrency.rates[symbol] = json[key].val;
                });
            promises.push(promise);
        });
        return Promise.all(promises).then(() => {
            console.log(ShopCurrency.rates);
            ShopCurrency.ready = true;
            ShopCurrency.gotCurrencies = true;
        });
    }

    connectedCallback(){
        document.addEventListener('currency-changed', (e) => {
            this.symbol = e.detail.symbol;
        })
    }

    valueChanged() {
        this._format();
    }

    symbolChanged(symbol) {
        if (Object.keys(ShopCurrency.symbols).indexOf(this.symbol) == -1) {
            throw new TypeError('No such currency symbol as "' + this.symbol + '"');
        }
        this._format();
    }

    _format() {
        this.formatted = isNaN(this.value) ? '-' : (this.value * ShopCurrency.rates[this.symbol]).toLocaleString(undefined, {
            style: 'currency',
            currency: ShopCurrency.symbols[this.symbol],
            currencyDisplay: 'symbol'
        });
        console.log('Formatted rv = ', this.formatted);
    }
}

ShopCurrency.ready = false;
ShopCurrency.gotCurrencies = false;

ShopCurrency.instance = null;

ShopCurrency.symbols = {
    '£': 'GBP',
    '€': 'EUR',
    '$': 'USD',
    'HUF': 'HUF'
};

// Factors by which to multiply the values in the data source
ShopCurrency.rates = {
    '£': 1,
    '€': 0,
    '$': 0,
    'HUF': 0
};

customElements.define(ShopCurrency.is, ShopCurrency);

if (!ShopCurrency.gotCurrencies) {
    ShopCurrency.getRates();
}
