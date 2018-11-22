import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './shop-icons.js';
import './shop-image.js';
import './shop-select.js';

import { I18n } from './shop-i18n';
import './shop-currency.js';
import { getTemplate } from './getTemplate';
import * as view from './shop-cart-item.template.html';

class ShopCartItem extends I18n(PolymerElement) {

  static get template() {
    return getTemplate(view);
  }

  static get is() { return 'shop-cart-item'; }

  static get properties() {
    return {
      entry: Object
    }
  }

  _quantityChange() {
    this._setCartItem(parseInt(this.$.quantitySelect.value, 10));
  }

  _setCartItem(quantity) {
    this.dispatchEvent(new CustomEvent('set-cart-item', {
      bubbles: true, composed: true, detail: {
        item: this.entry.item,
        quantity: quantity,
        size: this.entry.size
      }
    }));
  }

  _removeItem() {
    this._setCartItem(0);
  }

}

customElements.define(ShopCartItem.is, ShopCartItem);
