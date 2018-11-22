/*
https://polymer-library.polymer-project.org/3.0/docs/devguide/custom-elements#mixins

import { I18n } from './shop-i18n';    
class MyElement extends I18n(PolymerElement) {
    static get is() { return 'my-element' }
    }
}

i18next.t('key');

*/

import i18next from 'i18next';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const ShopTranslations = (superClass) => class extends superClass {

    constructor() {
        super();
        i18next.init({
            lng: 'en',
            debug: true,
            resources: ShopTranslations.translations
        });
    }

    t(key) {
        return i18next.t(key);
    }
}

export const I18n = dedupingMixin(ShopTranslations);

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
