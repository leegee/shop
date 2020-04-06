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

      failure: Boolean,

      _computedPrice: {
        type: Number,
      },

      _selectedSize: {
        type: Number,
      },

      _selectedQuantity: {
        type: Number,
      },
    }
  }

  static get observers() {
    return [
      '_itemChanged(item, visible)'
    ]
  }

  ready() {
    super.ready();
    this.$.sizesSelect.addEventListener('change', () => this._computePrice());
    this.$.quantitiesSelect.addEventListener('change', () => this._computePrice());
  }

  _computePrice(e) {
    const item = this.get('item');
    if (item) {
      console.log('_computePrice for item price, sizes, quantities: ', item.price, item.sizes, item.quantity);
      if (item.sizes && (item.price instanceof Array) && (item.sizes instanceof Array)) {
        this._computedPrice = item.price[this.$.sizesSelect.selectedIndex];
      } else {
        this._computedPrice = item.price;
      }

      if (item.quantities) {
        this._computedPrice = this._computedPrice * this.$.quantitiesSelect.value;
      }
    }

    console.log('_computePrice final', this._computedPrice);
  }

  _itemChanged(item, visible) {
    if (visible) {
      this._itemChangeDebouncer = Debouncer.debounce(this._itemChangeDebouncer,
        microTask, () => {
          this.$.desc.innerHTML = item ? item.description : '';

          // Reset the select menus.
          if (item) {
            ['sizes', 'quantities', 'options'].forEach(field => {
              if (item[field] && this.$[field + 'Select'].length === 0) {
                item[field].forEach((optionText, index) => {
                  console.debug('Set option %d for %s to %s', index, field, optionText);
                  const optionTextString = optionText.toString()
                  const optionEl = document.createElement('option');
                  if (index === 0) {
                    optionEl.setAttribute('selected', true);
                  }
                  optionEl.value = optionText;
                  optionEl.appendChild(document.createTextNode(
                    optionTextString.charAt(0).toUpperCase() + optionTextString.slice(1)
                  ));
                  this.$[field + "Select"].appendChild(optionEl);
                });
              }
            });

            this._computePrice();
          }


          this.dispatchEvent(new CustomEvent('change-section', {
            bubbles: true, composed: true, detail: {
              category: item ? item.category : '',
              title: item ? item.title : '',
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
      bubbles: true,
      composed: true,
      detail: {
        item: this._computedPrice, // this.item,
        quantity: this.$.quantitiesSelect ? Number(this.$.quantitiesSelect.value) : 1,
        size: this.$.sizesSelect ? this.$.sizesSelect.value : undefined,
        option: this.$.optionsSelect ? this.$.optionsSelect.value : undefined,
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
