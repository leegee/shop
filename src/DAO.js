

export class DAO {
    static _formatCurrency(total) {
        return DAO.symbol + (isNaN(total) ? '' : total.toFixed(2));
    }
}

DAO.symbol = '£';
