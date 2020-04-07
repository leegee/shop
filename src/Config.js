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
            spreadsheetId: process.env.spreadsheetid,
            googlesheetsapikey: process.env.googlesheetsapikey,
            range: 'Sheet1',
        }
    }

    // https://sheets.googleapis.com/v4/spreadsheets/SPREADSHEET_ID/values/RANGE?key=apiKey
    // https://developers.google.com/sheets/api/guides/concepts
    static getGoogleSheetsUrlForSheetName(sheetName) {
        return 'https://sheets.googleapis.com/v4/spreadsheets/'
            + Config.googleSheetsApi.spreadsheetId + '/values/'
            + sheetName
            + '?key=' + Config.googleSheetsApi.googlesheetsapikey;
    };

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

    static get categoryList() {
        return [
            {
                name: 'donated_artwork',
                sheetName: 'donated_artwork',
                title: 'Donated Artwork',
                image: 'images/donated-artwork-large.jpg',
                placeholder: 'data:image/jpeg;base64,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',
            },
            {
                name: 'yin-yang',
                sheetName: 'yin-yang',
                title: 'Yin-Yang',
                image: 'images/rainbow-yin-yangs-large.png',
                placeholder: 'data:image/png;base64,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',
            },
            {
                name: 'speciality',
                sheetName: 'speciality',
                title: 'Speciality Items',
                image: 'images/speciality-large.jpg',
                placeholder: 'data:image/png;base64,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',
            },
            {
                name: 'publications',
                sheetName: 'publications',
                title: 'Publications',
                image: 'images/pk-man-dvd-large.png',
                placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAyCAIAAAB6aqTlAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHVaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+NTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4yPC90aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqw4zLdAAAS60lEQVQYGQXB2bNlZ3ke8Od5v2+ttffZ3ef0pB40ddNq1BpaYlC3JGg0GCFhiUEQEwQJVa7ENqlUnMrgquRfSFK+y11yk0qZYBzbpLB9gQXCYCEJIQlBi1a3hh7U41Gf+eyz915rfe/75PfjvzvyKRMMVQWrmEaoduV6H/KtNjhs9cJcVf7jV+1HL9lrl6feXdfsarQfxuRGzMaIiaITwiqb26lUYW5Xmi179H34dDZu+63wQKpyM4LYtdMIhwqAuhrWde7azuUQhQjRCZea+W25FxJIRAerwpzGMCMqoKEqpmZu4ON2zXCl9+vyNS+rig1wrOgQsnzTvY8efeqznqrRXBN97xJSOv3aqWu//tnqlfOj+f0Pf+MPLr516t1X/jqCIqrBwkcf/adHPn7Pi3/+3fUrZwia4CZT0LyiZScCIBJAKYFmYFKqxQFtQO67cKPcedsH7964LF+NMkbZhG9FaRkupbqaP3jw5Bce6fuSswEUAOOnPvfA8//34Evf/R+52XH/I/d17eTsL6u+nzGlg/c/8bV/+/UXf/h6260WtElwhpQCAkim3IOmJAFkQvEwEKRlpLlkwzoNt+9Y/uC9C+iXIrYsbRa1Qgf0MkdYhFseTze/86ffa9cWg3BpuH37U9/84kNPnXjz+efLbDNXWUwpDYrFrUce+vK3v3Hu7NVfv/DD9aXLCoZMghgAKSiUXSIJiFAPBiBAsoa2mZIe+aTumj/33YuLzpXgzL1T6pEdKugDyViJBnJy9d0rZ192QZLlnMQ//tN/Pzpw89r5t909JSNw095Dj3/9ufmF4d/9z79aOf8WgsYsRTBJASjoZGtFDChgITOaIEkh9a6Zqbp5fuXUpfWJTSJPYS1SSyuAS0WVy9AsdGFG83BXhEqnmBZfW/6wdE6mwgQjweG2HQ9+8bkTj937N//rh0tnfurdFtFDLRFCKxTBXV2RLGAlzGEQQiCNsABE9K7F1347f/dhV4HCRAkmUAmoskhUmI0H1gtBMrECzSxVdb3r5tsCGm9sKEDQcvWR409+/ptPnX3r8vJ7r423liOKBwqisAAk3MDMumadQyhgAgIkBIIEQYdc2lqb5FGeS3mWSsk5ee6FnqlXJbRGZVZ9UTNojn32qSMnjkuEcTDa9uCTD557+8ps5QrJCA137v7qFx5cXtq474FDP99xIKc61IYsAEkucwgMwebI3DElUICgSgoQIAGBAvtp165vVOBCSjuHzeI0ZpEqDoq0pcFWTBE+qKsm1Z//5pMkQSQgpJWlzZ/9v+cnNy7N7z2s4ImTd62vbb7wVy99+V8+cfwLT6x/cGr5xhWDIAgISki9FIgWnh0QEIiMGkg5zI0OFIcXxKzvxl2nELi7mptPubi30rXp5kQ9GDL2jq3p9Pnv/bzv20xvneFx9Z3zGxdfn002FgQDEHr+z/5+6dSLr92+89FnP/363x5bX1vruwnhYkABISSnein3CgNNFAUAUEJki2ARq8Henf1s0nlpS7natyW6to+WMdGslwPy6CkPlUuvv/Lh+2/0BakeerfZtVu9u5gAgPrFT3515Y0XxisfvvuTl0987hP3f+7x1ctnlxevkqSCUGY4PKAC5JkigxWTEGI4CmQMq63qEF3y8fLGZttvdmUWbYlC9AUqorMIHCzcEkik9aUfj9c9qG7ifQsgQEB9KRHRjqeTra0ubO3yO6/+8I1Hnn34zR/fu7GyVPqAQAVoRpjAgLURLdQqWsVMZSafqUyjTLxMw9fX15q9u9ajW/bZUhmvxOaKTzeiHWs2Cd+Mfn39avQTCRHeAb3U910HdrCC5KzMMiCxdCp99Iur19564WddWz72xMnhjt2FLFCBeqhIIQpmTuulluioAnWImUoLb+HT8OGRw++d+tVS50ulX4l2Q2UDMVY/Vr8V3Uxtl1JBIjEupfXoUGZgD/VgAcAUeR6kl+jDp/ItL9eunn3p+ddP/M4nRvtu76kJNJOXkESQiTBHOMIjXOoRAQXlYIGKae99t7/zizOTKAVyVH1UrWIsTlUmKpOI1ba08oDYjKbgRJhF34XaiGnENLyfrYWLiVOVVjGVrq9++OqPXuiKH3/mKc1tm0ETRQ8VhVQApVt2foSg0SRAkYRsZqoqy4MaRx6+68Jv315fadvwQDjdoU7eKVqoA8VUD3ZvjfXr119e2fiwE52pl0AC6NUVWWD+3DtnLl4804UXqcA3x8vLS9zcmJ498+a0mwoBApCYUpP5mY88IbkgSAZUtIq5VjNMzc5h/dBXP7V+9dKpf3x/vcxcnSsKiksBz6lpmuF4upFSrcxpO/HAsJkbjfasbFyK4gYRMWwWqiavT5bVE0QyawbbZ7ONOlVmqe+mzWDbtmawtbmCUMBH83MGRYI1TDWS0QgKCiqgiFhfXldlHfqQAnBEhyiQmI7ed/Jf/Of/tHv/oXE/3ZhudaGU0/HPPPONb//R9vk9juilZm73l7/1r5949ltVM2pZWvhofs+3vv0nd979SC+f9DPWg8ee/ubnnvvD0Y6bezIIJ41kMstMyYw0IpGZEFQQqkej3lvBghDoMCE5U6S0sOemx3/34eMnPzsabQNI2N69h7703DNHjh7cvn0XLFvK+2654/GnH3r86ZP79t9BVmQaze+7+4EjX3ruK/sOHCYt5XrfLfsPHbmlGlRhKEAHGoMSi+RQEgGaaKAhk/R+ZvUwJBcCDJiQAkzWDJrh8o31J77y6G233JXN5kcLH/vEyQO37I6IOlWZedgM77zr45PpbPvC3JE77xs2cznXOedkduLk/cc+dnIwGJkl0owsKh28A0IwIyFJhBKRSJJGJDB5xOK7l3fdup9GIkkJTKCRNCA81jfG2xaGxz5xYqHetm/ngSe+/NgvXjozN8oJzEzbR7sffPTjF05fff/05RMnH9y9ex/FbHVKeOXnp7/+R186eOgYgIgAGAoBApxuDaoBqiHrAZsadaOmRtOgyTCzppv5tp27UqqJRKZEy0gVzGRVSsnsjZ+9/9mvfPqO2+45es/D2+abyY1pRNRIc2lw8Oa7jt5z2xs//9VLz//i/gfv2Lf7o4mpa1tLXL6yXjp/8ktf3HvTbWYkEQrSRILMtdUZOaMiAKJitT3XcykRUip3furj5155g54SE8GkVBgBq2xY5ypKf+XV0w+cPPTA7zx514OHX/3hqXZtk3akUtWk+uj9xxavrU6Xrm1ErK9u3XvfsUvn36xTArCydP0H37nyh3/yT06/eZo0F3MekkkMwfIQw+2pqZBalaJoLO00m6+sCy+WRjvnzry0EnBAFAhrmAXOWVbbA5xeX3z5r1975LmTq0vrl994a8+t+41MSHsXDnz85LGE6omvPoOEbsZ7Ttz5y58eMCS5vG3ffuuNF3909Gu//8Vz7y7XdTYYxaRsSmbkRkxvxMZGTFq0W5pd7NbPbq1eb9tMs96HO0YADCBlpowYsqlldTIaunZ88Re/mY4np3782+WrF9yLIhragQOHDty+a7CtOvyxgweP3lInHL3/4M23HK6ZUk5NbjZXrr/8tz8djprbDu2NvliATAZmWO7VlgiQAAQLRWWZrBZS3fb+mx+8ePxfff7G+e9j0xQhsWLOYBLQFimMvHHpwvP//e/Wrl7z2TSnnLLN182Rh+679P7iK995fmNjtWXaPjf3zB8/e/cDx079wyYgBcJ1/r1f/eB/H/z9//B7y4tLVUpJBHJCygnJUnKFK6Qwpga2zwZ7kq17G2O7+tNTJ5556NT335zNOjIRJGWyTJhQuUc3vfjLVx1uCPUlSszP7z726btf/P5LF878enWy3kbUTbP/hcMPPvnJ9197m1JXOo+yujX5zUv/8Nrxo0J07YxABTRgunvn0ZCHQpAxiCJGilTEmXsD9pPxgRNHrr7+vhdmpsRCgMJoNELdXH/9tLdtBSNSjWo0N9fBVs9fqxZG7/30jdWV6yVCUHj0E23bs+f86Q/c04Uz5xavnzdhOhuvXd7opnH+zJsqpZEGTc2vHnoWBAAJhFdkRh5asx1VTe6oU97Be//N06/817+ZTdQDBaJEcJht0Mx103GEjFUiElUlG+fUdl1VDzdnWzNvO5VeUQAam8HctJ2mXPd9X6IXesHNUmJy76ggsG1hmCsYBQCCCJpYkwzvyAqVu4/6FEsbu3JGgx1mY9flrszkXenbftMsEkiBtDZ81duuC0DTMguIQEIiLEkK9ZOJQcVnAhIsQMG8FNEJJjQZqFHnRACURCCByeoBrSYb5QqsLNWJjYhQBR6q89VZuayAehckObxnaqBZlKIoCKdDApIEUYCMTJZdxSBXAC6Foa5sm9EI79ECygLhJmSqQClZApCV51A1SJUAeI9oA93c3HRzsyuY9uWFtl8PL+gEORUkVSVZwGEMKOAKAxj0IEIOCkpSD4EIogBKNNIMUPQOh1QzkQaShhxEBg0krQYbpIGlmVpHIOTejxZ2bKxvTPq2BKcKp6S6Vx8QaAbSEkXBDQjWhgg4hIACNhzU7ayFKrBIAiBIiIiZk0IvyZgCCgXQS2YuCRAohYjCMo02yUZoKg76sBuXP5w7tH9ST9dVZiKQXOhBBwMC6YpOZabSwluVVt7Le7gASI//s9+tt+fC3hUuuCCYEAEXXAhQgdJr5mwDvaOYiEI4Q3AIEo11hZoywsCq34h3//Gte77y6VTJTR2iZwlICIEB9GBLb6EZSofS03uiAD3QU/sGvOXWm3qgEGHm5GZsShAFOiBAoRBdCEFBtxRIiiQn4ZDDXWqpGVAIISY9Fk9f33HHrRzCI0pEIEAvgEtFpagvkkMdUMBO6oCedMihv/zzv7+xeqWgc0UoLvQX327Pnm3PAZIgqcgFAQAgQEC6e9fdyVKiGS2RZHZAgCt6eCt3AIqun+68dffypeVOcCFAB42CJUBgFJqgkCQIDMKhAEj76NG9K2ttcTl1rns/iE6zbRxlVjICMgRAgcZoBo2BJgAAQAEF6lBa9C1LF8WhoGahy7/94NYTH62208yCCJJkiL28QxRIgmQCYCYChCgBm7PZic8//V++99+G2wdb2goIgAgHAgqAtCDDLMhg6pHSfTuOJkMiKsCUQA9EgVzhkAgAAZYu1m/ceOQPvjBeXByvToOUIBIgSBgBEBAVAghAAkgY7c5P3fvQUw9vr6qND5evrV3p3Rds4aZqF2gBEABoZALEqJpBemD3vRWYaBVYkQQgBgSQZBCEQhLQrZcP37vw0D//3IVfvtMXSAggCAgAJAkQSRKAQIKkCTh816H7Hz72kdsPfOLWA9hov3z8M3vy7sWVDZCEGWkkSYEAmqZKj+6+JzE14ICsAABkolEASIqkkWYyl6ONXbftnq2vjVdbBwMRRAABiRRTKARIAmBmUojaNb/9oXsOj8+c/+Dt9+/YcyDD7j9yeJDTpevLACmBBABAsFQ36ff23DWi5gxDsTJPZAIIACRBJpI0JpC0bCw+ue2eQ1feXiwSKAIiBAAQHDAJAEgCEGRIo2F14tb9Ny5c3lzbnM3ajfXx9aWlZLixtjlpOwMECYIkqhlU+c7kE7GXtRaF2grrqKk4JWeCU4CoIGngMKV7H/vka3/xE4MlE2HFHQQAAABJQhIAiaSJYPng3NXLF69uLK3O2vb66tK07S7euL5zsL2uI0EBSBIAAICI/BHLU3GiNIFPFEOLTREkhQQUGADADEpmCwe2071sBAELBJFASABAE2BAAEYjRBCkQHTl3IUr4421WddCeu3iO9e21h/Yf8dorq5sWkIGC0gAzBJSPmTcVDWRVlWtQgYnMyMacgoIJQj3KgxV0p7bd2+ev4YeFSRYknoiC0FBACAiWcoIg0ECACpRi0tLUFnZXN8os9evv9d5kEYooamUAiYF4BSyIm9jrmANzKkSEGohhzlDmUHCgZISqZxx8Pjdv/qzH5ssU2EMhImAggBBEgKBBGYIZkAYzKgqp1OXz1/bWD5z4/JaPzmY957+8HxCPj78qNFEQJKSSzWUXbkHHEZIMIccyuJ2MzALCMAhGNREqMQWSANkgMlACi6IlqRIZlQkWIUYMCp0FGVp13B0977b+uj3Ted9HLtYzzi36Ju1+oYmSEABe6CCsjHlsKCGxDaxJwD0SC6G0RUiXYEs7BzmzW4u0gyW5Y4QGTQqBIFO0KjMqIAGmjNvIMo4zJdXFrcN5vYNd3A3N7rZjXb9nnp+sd0ITHew6sECusHl2VLONJqSOAVrKgGVMCFnREgCINBYHd6z99kHLv3li/MqIvqECDkAOhBQAGZWMtEgKniDGFAVAJYS+j9nX50WXxiMxv2suK/146/N7T/TNaF+nqWHFcoFNyQrGWAiEjEQi2kuuGxYDoyFInkyCNmsouXVzXxtfYRkhlDAFBAoUKaU6JVkYAUMaImsyYSw8Hdnq79dv1hoACSBzMJO4rHBznd9ujfNd/BO6qUOXnHw/wF4dueKWpobwAAAAABJRU5ErkJggg==',
            },
        ];
    };

    // This is local, not in Sheets, to avoid delaying the time to first paint.
    static get ORIGINAL_categoryList() {
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

    static get googleAnalyticsKey() {
        return 'foo-bar' || undefined;
    }

    static get payPalSandboxClientId() {
        return process.env.ppclientid;
    }

    static get useSandbox() {
        return true;
    }
}
