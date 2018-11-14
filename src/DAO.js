export class DAO {
    static setSymbol(symbol) {
        if (Object.keys.indexOf(symbol) == -1) {
            throw new TypeError('No such currency symbol as "' + symbol + '"');
        }
        DAO.symbol = symbol;
    }

    static _formatCurrency(total) {
        return isNaN(total) ? '-' : (total * DAO.rates[DAO.symbol]).toLocaleString(undefined, {
            style: 'currency',
            currency: DAO.symbols[DAO.symbol],
            currencyDisplay: 'symbol'
        });
    }

    static getRates() {
        const url = 'http://free.currencyconverterapi.com/api/v5/convert?compact=y&q=';
        const promises = [];
        Object.keys(DAO.symbols).filter(symbol => symbol !== 'HUF').forEach(symbol => {
            const key = DAO.symbols[symbol] + '_HUF';
            const promise = fetch(url + key)
                .then(res => {
                    return res.json();
                })
                .then(json => {
                    DAO.rates[symbol] = json[key].val;
                });
            promises.push(promise);
        });
        return Promise.all(promises).then(() => {
            console.log(DAO.rates);
            DAO.ready = true;
        });
    }

    constructor() {
        if (DAO.instance) {
            return DAO.instance;
        }
        DAO.instance = this;
    }
}

DAO.ready = false;

DAO.instance = null;

DAO.symbols = {
    '£': 'GBP',
    '€': 'EUR',
    '$': 'USD',
    'HUF': 'HUF'
};

// Factors by which to multiply the values in the data source
DAO.rates = {
    '£': 0,
    '€': 1,
    '$': 0,
    'HUF': 0
};

// Set the initial value of the symbol to that used in the data source and ignored in the conversion, as is a factor of 1
DAO.symbol = '€';
