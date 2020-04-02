if (!process.env.googlesheetsapikey) {
    console.error(process.env);
    throw new TypeError('Environment variable googlesheetsapikey not set! Set to a key for Google Sheets API');
}

if (!process.env.currencyconverterapikey) {
    console.error(process.env);
    throw new TypeError('Environment variable currencyconverterapikey not set! Set to a key for currencyconverter.com API');
}

export class Config {
    static get defaultlanguage() {
        return 'en';
    }

    static get languages() {
        return undefined;
        return [
            {
                value: 'en',
                name: 'English',
            }, {
                value: 'hu',
                name: 'Magyar',
            }
        ];
    }

    static get googleSheetsApi() {
        return {
            spreadsheetId: '12R_GOM47f9rgvIDveaZkfRiwZjUMHBicbIzXVIotDPs',
            range: 'Sheet1',
            googlesheetsapikey: process.env.googlesheetsapikey
        }
    }

    static get chars2symbols() {
        return {
            '£': 'GBP',
            '€': 'EUR',
            '$': 'USD',
            'HUF': 'HUF'
        }
    }

    static get defaultSymbol() {
        return {
            symbol: 'USD',
            char: '$'
        }
    }

    static get currencyconverterapikey() {
        return process.env.currencyconverterapikey;
    }

    static get currencyConvertorURL() {
        return undefined; // Turns off currency conversion
        return '//free.currconv.com/api/v7/convert?compact=ultra&' +
            'apiKey=' + encodeURIComponent(Config.currencyconverterapikey) +
            'q=';
    };

    // This is local, not in Sheets, to avoid delaying the time to first paint.
    static get categoryList() {
        return [
            {
                name: 'mens_outerwear',
                sheetName: 'mens_outerwear',
                title: 'Men\'s Clothes',
                image: 'images/mens_outerwear.jpg',
                placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAXAABAQEAAAAAAAAAAAAAAAAAAAIEAQEAAAAAAAAAAAAAAAAAAAACEAAAAwYHAQAAAAAAAAAAAAAAERMBAhIyYhQhkaEDIwUVNREBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A3dkr5e8tfpwuneJITOzIcmQpit037Bw4mnCVNOpAAQv/2Q=='
            },
            {
                name: 'ladies_outerwear',
                sheetName: 'mens_outerwear',
                title: 'Ladies\' Outerwear',
                image: 'images/ladies_outerwear.jpg',
                placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAWQABAQAAAAAAAAAAAAAAAAAAAAEBAQEAAAAAAAAAAAAAAAAAAAIDEAABAwMFAQAAAAAAAAAAAAARAAEygRIDIlITMwUVEQEBAAAAAAAAAAAAAAAAAAAAQf/aAAwDAQACEQMRAD8Avqn5meQ0kwk1UyclmLtNj7L4PQoioFf/2Q=='
            },
            {
                name: 'mens_tshirts',
                sheetName: 'mens_outerwear',
                title: 'Men\'s T-Shirts',
                image: 'images/mens_tshirts.jpg',
                placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAWwABAQEAAAAAAAAAAAAAAAAAAAMEAQEAAAAAAAAAAAAAAAAAAAAAEAABAwEJAAAAAAAAAAAAAAARAAESEyFhodEygjMUBREAAwAAAAAAAAAAAAAAAAAAAEFC/9oADAMBAAIRAxEAPwDb7kupZU1MTGnvOCgxpvzEXTyRElCmf//Z'
            },
            {
                name: 'ladies_tshirts',
                sheetName: 'mens_outerwear',
                title: 'Ladies\' T-Shirts',
                image: 'images/ladies_tshirts.jpg',
                placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAXwABAQEAAAAAAAAAAAAAAAAAAAMFAQEBAAAAAAAAAAAAAAAAAAABAhAAAQIDCQAAAAAAAAAAAAAAEQABITETYZECEjJCAzMVEQACAwAAAAAAAAAAAAAAAAAAATFBgf/aAAwDAQACEQMRAD8AzeADAZiFc5J7BC9Scek3VrtooilSNaf/2Q=='
            }
        ];
    }

    // https://sheets.googleapis.com/v4/spreadsheets/SPREADSHEET_ID/values/RANGE?key=apiKey
    // https://developers.google.com/sheets/api/guides/concepts
    static getGoogleSheetsUrlForSheetName(sheetName) {
        return 'https://sheets.googleapis.com/v4/spreadsheets/'
            + Config.googleSheetsApi.spreadsheetId + '/values/'
            + sheetName
            + '?key=' + Config.googleSheetsApi.googlesheetsapikey;
    };

    static get googleAnalyticsKey() {
        return 'foo-bar' || undefined;
    }

    static get payPalSandboxClientId() {
        return process.env.ppclientid;
    }

    static get useSandbox(){
        return true;
    }
}
