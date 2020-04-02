import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './shop-button.js';
import './shop-category-data.js';
import './shop-common-styles.js';
import './shop-image.js';
import './shop-select.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { microTask } from '@polymer/polymer/lib/utils/async.js';

import { I18n } from './shop-i18n';
import './shop-currency.js';
import { getTemplate } from './getTemplate';
import * as view from './shop-detail.template.html';

class ShopDetail extends I18n(PolymerElement) {
  static get template() {
    return getTemplate(view);
  }

  static get is() { return 'shop-detail'; }

  static get properties() {
    return {

      item: Object,

      route: Object,

      routeData: Object,

      visible: {
        type: Boolean,
        value: false
      },

      offline: {
        type: Boolean,
        observer: '_offlineChanged'
      },

      failure: Boolean

    }
  }

  static get observers() {
    return [
      '_itemChanged(item, visible)'
    ]
  }

  _itemChanged(item, visible) {
    if (visible) {
      this._itemChangeDebouncer = Debouncer.debounce(this._itemChangeDebouncer,
        microTask, () => {
          this.$.desc.innerHTML = item ? item.description : '';

          // Reset the select menus.
          if (item) {
            if (item.quantities) {
              this.$.quantitySelect.value = '1';
            }
            if (item.sizes) {
              this.$.sizeSelect.value = 'M';
            }
          }

          this.dispatchEvent(new CustomEvent('change-section', {
            bubbles: true, composed: true, detail: {
              category: item ? item.category : '',
              title: item ? item.title : '',
              // description: item ? item.description.substring(0, 100) : '',
              description: item ? item.description : '',
              image: item ? this.baseURI + item.image : ''
            }
          }));
        })
    }
  }

  _unescapeText(text) {
    let elem = document.createElement('textarea');
    elem.innerHTML = text;
    return elem.textContent;
  }

  _addToCart() {
    // This event will be handled by shop-app.
    this.dispatchEvent(new CustomEvent('add-cart-item', {
      bubbles: true, composed: true, detail: {
        item: this.item,
        quantity: this.$.quantitySelect ? parseInt(this.$.quantitySelect.value, 10) : 1,
        size: this.$.sizeSelect ? this.$.sizeSelect.value : undefined,
      }
    }));
  }

  _isDefined(item) {
    return item != null;
  }

  _tryReconnect() {
    this.$.categoryData.refresh();
  }

  _offlineChanged(offline) {
    if (!offline) {
      this._tryReconnect();
    }
  }
}

customElements.define(ShopDetail.is, ShopDetail);
