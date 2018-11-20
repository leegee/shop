if (!process.env.googlesheetsapikey) {
    console.error(process.env);
    throw new TypeError('Environment variable googlesheetsapikey not set! Set to a Google key for Google Sheets API');
}

export class Config {
    // https://docs.google.com/spreadsheets/d/12R_GOM47f9rgvIDveaZkfRiwZjUMHBicbIzXVIotDPs/edit#gid=0
    // https://sheets.googleapis.com/v4/spreadsheets/SPREADSHEET_ID/values/RANGE?key=apiKey
    // https://sheets.googleapis.com/v4/spreadsheets/12R_GOM47f9rgvIDveaZkfRiwZjUMHBicbIzXVIotDPs/values/mens_outerwear?key=AIzaSyD2mfHeSMho_JqZYvBbNvkdqr3gumGQsWk
    // https://developers.google.com/sheets/api/guides/concepts    
    static getGoogleSheetsUrl(sheetName) {
        return 'https://sheets.googleapis.com/v4/spreadsheets/'
            + Config.googleSheetsApi.spreadsheetId + '/values/'
            + sheetName
            + '?key=' + Config.googleSheetsApi.googlesheetsapikey;
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
    };

    static get defaultSymbol() {
        return {
            symbol: 'EUR',
            char: '€'
        }
    }

    static get categoryList() {
        return [
            {
                name: 'mens_outerwear',
                sheetName: 'mens_outerwear',
                url: 'data/mens_outerwear.json',
                title: 'Men\'s Outerwear',
                image: 'images/mens_outerwear.jpg',
                placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAXAABAQEAAAAAAAAAAAAAAAAAAAIEAQEAAAAAAAAAAAAAAAAAAAACEAAAAwYHAQAAAAAAAAAAAAAAERMBAhIyYhQhkaEDIwUVNREBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A3dkr5e8tfpwuneJITOzIcmQpit037Bw4mnCVNOpAAQv/2Q=='
            },
            {
                name: 'ladies_outerwear',
                sheetName: 'mens_outerwear',
                url: 'data/ladies_outerwear.json',
                title: 'Ladies\' Outerwear',
                image: 'images/ladies_outerwear.jpg',
                placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAWQABAQAAAAAAAAAAAAAAAAAAAAEBAQEAAAAAAAAAAAAAAAAAAAIDEAABAwMFAQAAAAAAAAAAAAARAAEygRIDIlITMwUVEQEBAAAAAAAAAAAAAAAAAAAAQf/aAAwDAQACEQMRAD8Avqn5meQ0kwk1UyclmLtNj7L4PQoioFf/2Q=='
            },
            {
                name: 'mens_tshirts',
                sheetName: 'mens_outerwear',
                url: 'data/mens_tshirts.json',
                title: 'Men\'s T-Shirts',
                image: 'images/mens_tshirts.jpg',
                placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAWwABAQEAAAAAAAAAAAAAAAAAAAMEAQEAAAAAAAAAAAAAAAAAAAAAEAABAwEJAAAAAAAAAAAAAAARAAESEyFhodEygjMUBREAAwAAAAAAAAAAAAAAAAAAAEFC/9oADAMBAAIRAxEAPwDb7kupZU1MTGnvOCgxpvzEXTyRElCmf//Z'
            },
            {
                name: 'ladies_tshirts',
                sheetName: 'mens_outerwear',
                url: 'data/ladies_tshirts.json',
                title: 'Ladies\' T-Shirts',
                image: 'images/ladies_tshirts.jpg',
                placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAXwABAQEAAAAAAAAAAAAAAAAAAAMFAQEBAAAAAAAAAAAAAAAAAAABAhAAAQIDCQAAAAAAAAAAAAAAEQABITETYZECEjJCAzMVEQACAwAAAAAAAAAAAAAAAAAAATFBgf/aAAwDAQACEQMRAD8AzeADAZiFc5J7BC9Scek3VrtooilSNaf/2Q=='
            }
        ];
    }
}