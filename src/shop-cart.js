import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shop-button.js';
import './shop-common-styles.js';
import './shop-form-styles.js';

import { I18n } from './shop-i18n';
import './shop-currency.js';
import { getTemplate } from './getTemplate';
import * as view from './shop-cart.template.html';

class ShopCart extends I18n(PolymerElement) {

  static get template() {
    return getTemplate(view);
  }

  static get is() { return 'shop-cart'; }

  static get properties() {
    return {
      sybmol:  {
        type: String,
        value: '£'
      },
      total: Number,
      cart: Array,
      visible: {
        type: Boolean,
        observer: '_visibleChanged'
      },
      _hasItems: {
        type: Boolean,
        computed: '_computeHasItem(cart.length)'
      }
    }
  }

  _computeHasItem(cartLength) {
    return cartLength > 0;
  }

  _getPluralizedQuantity(quantity) {
    return quantity + ' ' + (quantity === 1 ? 'item' : 'items');
  }

  _visibleChanged(visible) {
    if (visible) {
      // Notify the section's title
      this.dispatchEvent(new CustomEvent('change-section', {
        bubbles: true, composed: true, detail: { title: 'Your cart' }
      }));
    }
  }

}

customElements.define(ShopCart.is, ShopCart);
