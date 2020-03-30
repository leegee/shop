/*
https://polymer-library.polymer-project.org/3.0/docs/devguide/custom-elements#mixins

    import { I18n } from './shop-i18n';    
    class MyElement extends I18n(PolymerElement) { }

JS: 

    this.t('key');

HTML: 

    <span>[[t('foo')]]</span>


*/

import { Config } from './Config';
import i18next from 'i18next';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const ShopTranslations = (superClass) => class extends superClass {

    constructor() {
        super();
        i18next.init({
            lng: ShopTranslations.currentLanguage,
            debug: true,
            resources: ShopTranslations.translations
        });
    }

    get languages() {
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

    t(key) {
        return i18next.t(key);
    }

    changeLanguage(localeKey) {
        ShopTranslations.currentLanguage = localeKey;
        i18next.changeLanguage(ShopTranslations.currentLanguage);
        document.location.search = ShopTranslations.currentLanguage;
    }

    get currentLanguageKey() {
        return ShopTranslations.currentLanguage;
    }
}

ShopTranslations.defaultLanguage = Config.defaultLanguage;

// TODO Check we have the language
ShopTranslations.currentLanguage = window.location.search.substr(1, 2) || ShopTranslations.defaultLanguage;

ShopTranslations.translations = {
    en: {
        translation: {
            "shop": "shop",
            "shop-home": "Shop - Home",
            "shopping cart": "shopping cart"
        }
    },
    hu: {
        translation: {
            "shop": "bolt",
            "shop-home": "Bolt - Home"
        }
    }
}

export const I18n = dedupingMixin(ShopTranslations);
