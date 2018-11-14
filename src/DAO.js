export class DAO {
    static _formatCurrency(total) {
        return DAO.symbol + (isNaN(total) ? '' : total.toFixed(2));
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
        Promise.all(promises).then(() => {
            console.log(DAO.rates);
        });
    }

    constructor() {
        if (DAO.instance) {
            return DAO.instance;
        }
        DAO.instance = this;
    }
}

DAO.instance = null;

DAO.symbol = '£';

DAO.symbols = {
    '£': 'GBP',
    '€': 'EUR',
    '$': 'USD',
    'HUF': 'HUF'
};

DAO.rates = {
    '£': 0,
    '€': 0,
    '$': 0,
    'HUF': 1
};
