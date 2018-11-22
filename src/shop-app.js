import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { scroll } from '@polymer/app-layout/helpers/helpers.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';

import './shop-category-data.js';
import './shop-home.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';

import { I18n } from './shop-i18n';
import './shop-currency.js';
import { getTemplate } from './getTemplate';
import * as view from './shop-app.template.html';
import { Config } from './Config';

// performance logging
window.performance && performance.mark && performance.mark('shop-app - before register');

class ShopApp extends I18n(PolymerElement) {
  static get template() {
    return getTemplate(view);
  }

  static get is() { return 'shop-app'; }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },

      numItems: {
        type: Number,
        value: 0
      },

      _shouldShowTabs: {
        computed: '_computeShouldShowTabs(page, smallScreen)'
      },

      _shouldRenderTabs: {
        computed: '_computeShouldRenderTabs(_shouldShowTabs, loadComplete)'
      },

      _shouldRenderDrawer: {
        computed: '_computeShouldRenderDrawer(smallScreen, loadComplete)'
      }
    }
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ]
  }

  constructor() {
    super();
    window.performance && performance.mark && performance.mark('shop-app.created');
  }

  ready() {
    super.ready();
    // Custom elements polyfill safe way to indicate an element has been upgraded.
    this.removeAttribute('unresolved');
    // listen for custom events
    this.addEventListener('add-cart-item', (e) => this._onAddCartItem(e));
    this.addEventListener('set-cart-item', (e) => this._onSetCartItem(e));
    this.addEventListener('clear-cart', (e) => this._onClearCart(e));
    this.addEventListener('change-section', (e) => this._onChangeSection(e));
    this.addEventListener('announce', (e) => this._onAnnounce(e));
    this.addEventListener('dom-change', (e) => this._domChange(e));
    this.addEventListener('show-invalid-url-warning', (e) => this._onFallbackSelectionTriggered(e));
    // listen for online/offline
    afterNextRender(this, () => {
      window.addEventListener('online', (e) => this._notifyNetworkStatus(e));
      window.addEventListener('offline', (e) => this._notifyNetworkStatus(e));
    });
  }

  _routePageChanged(page) {
    if (this.page === 'list') {
      this._listScrollTop = window.pageYOffset;
    }

    this.page = page || 'home';

    // Close the drawer - in case the *route* change came from a link in the drawer.
    this.drawerOpened = false;
  }

  _pageChanged(page, oldPage) {
    if (page != null) {
      let cb = this._pageLoaded.bind(this, Boolean(oldPage));
      switch (page) {
        case 'list':
          import('./shop-list.js').then(cb);
          break;
        case 'detail':
          import('./shop-detail.js').then(cb);
          break;
        case 'cart':
          import('./shop-cart.js').then(cb);
          break;
        case 'checkout':
          // import('./shop-checkout.js').then(cb);
          import('./shop-checkout-paypal.js').then(cb);
          break;
        default:
          this._pageLoaded(Boolean(oldPage));
      }
    }
  }

  _pageLoaded(shouldResetLayout) {
    this._ensureLazyLoaded();
    if (shouldResetLayout) {
      // The size of the header depends on the page (e.g. on some pages the tabs
      // do not appear), so reset the header's layout only when switching pages.
      timeOut.run(() => {
        this.$.header.resetLayout();
      }, 1);
    }
  }

  _ensureLazyLoaded() {
    // load lazy resources after render and set `loadComplete` when done.
    if (!this.loadComplete) {
      afterNextRender(this, () => {
        import('./lazy-resources.js').then(() => {
          // Register service worker if supported.
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js', { scope: '/' });
          }
          this._notifyNetworkStatus();
          this.loadComplete = true;
        });
      });
    }
  }

  _notifyNetworkStatus() {
    let oldOffline = this.offline;
    this.offline = !navigator.onLine;
    // Show the snackbar if the user is offline when starting a new session
    // or if the network status changed.
    if (this.offline || (!this.offline && oldOffline === true)) {
      if (!this._networkSnackbar) {
        this._networkSnackbar = document.createElement('shop-snackbar');
        this.root.appendChild(this._networkSnackbar);
      }
      this._networkSnackbar.innerHTML = this.offline ?
        'You are offline' : 'You are online';
      this._networkSnackbar.open();
    }
  }

  _toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }

  _setMeta(attrName, attrValue, content) {
    let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
  }

  // Elements in the app can notify section changes.
  // Response by a11y announcing the section and syncronizing the category.
  _onChangeSection(event) {
    let detail = event.detail;

    // Scroll to the top of the page when navigating to a non-list page. For list view,
    // scroll to the last saved position only if the category has not changed.
    let scrollTop = 0;
    if (this.page === 'list') {
      if (this.categoryName === detail.category) {
        scrollTop = this._listScrollTop;
      } else {
        // Reset the list view scrollTop if the category changed.
        this._listScrollTop = 0;
      }
    }
    // Use `Polymer.AppLayout.scroll` with `behavior: 'silent'` to disable header scroll
    // effects during the scroll.
    scroll({ top: scrollTop, behavior: 'silent' });

    this.categoryName = detail.category || '';

    // Announce the page's title
    if (detail.title) {
      document.title = detail.title + ' - ' + this.t('shop');
      this._announce(detail.title);
      // Set open graph metadata
      this._setMeta('property', 'og:title', detail.title);
      this._setMeta('property', 'og:description', detail.description || document.title);
      this._setMeta('property', 'og:url', document.location.href);
      this._setMeta('property', 'og:image', detail.image || this.baseURI + 'images/shop-icon-128.png');
      // Set twitter card metadata
      this._setMeta('property', 'twitter:title', detail.title);
      this._setMeta('property', 'twitter:description', detail.description || document.title);
      this._setMeta('property', 'twitter:url', document.location.href);
      this._setMeta('property', 'twitter:image:src', detail.image || this.baseURI + 'images/shop-icon-128.png');
    }
  }

  _onAddCartItem(event) {
    if (!this._cartModal) {
      this._cartModal = document.createElement('shop-cart-modal');
      this.root.appendChild(this._cartModal);
    }
    this.$.cart.addItem(event.detail);
    this._cartModal.open();
    this._announce(this.t('Item added to the cart'));
  }

  _onSetCartItem(event) {
    let detail = event.detail;
    this.$.cart.setItem(detail);
    if (detail.quantity === 0) {
      this._announce('Item deleted');
    } else {
      this._announce(this.t('Quantity changed to') + ' ' + detail.quantity);
    }
  }

  _onClearCart() {
    this.$.cart.clearCart();
    this._announce(this.t('Cart cleared'));
  }

  // Elements in the app can notify a change to be a11y announced.
  _onAnnounce(e) {
    this._announce(e.detail);
  }

  // A11y announce the given message.
  _announce(message) {
    this._a11yLabel = '';
    this._announceDebouncer = Debouncer.debounce(this._announceDebouncer,
      timeOut.after(100), () => {
        this._a11yLabel = message;
      });
  }

  // This is for performance logging only.
  _domChange(e) {
    if (window.performance && performance.mark && !this.__loggedDomChange) {
      let target = e.composedPath()[0];
      let host = target.getRootNode().host;
      if (host && host.localName.match(this.page)) {
        this.__loggedDomChange = true;
        performance.mark(host.localName + '.domChange');
      }
    }
  }

  _onFallbackSelectionTriggered() {
    this.page = '404';
  }

  _computeShouldShowTabs(page, smallScreen) {
    return (page === 'home' || page === 'list' || page === 'detail') && !smallScreen;
  }

  _computeShouldRenderTabs(_shouldShowTabs, loadComplete) {
    return _shouldShowTabs && loadComplete;
  }

  _computeShouldRenderDrawer(smallScreen, loadComplete) {
    return smallScreen && loadComplete;
  }

  _computePluralizedQuantity(quantity) {
    // TODO: config i18n pluralisation
    return quantity + ' ' + (quantity === 1 ? this.t('item') : this.t('items'));
  }

  currencySelectChanged() {
    this.$.currency.setAttribute('char', this.$.currencySelect.value);
    document.dispatchEvent(new CustomEvent('currency-changed', {
      bubbles: true,
      composed: true,
      detail: {
        char: this.$.currencySelect.value
      }
    }))
    console.log('_currencySelectChange local char = ', this.$.currency.char);
  }

}

customElements.define(ShopApp.is, ShopApp);
