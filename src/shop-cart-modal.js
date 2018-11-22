import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import { IronOverlayBehaviorImpl } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import './shop-button.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

import { I18n } from './shop-i18n';
import { getTemplate } from './getTemplate';
import * as view from './shop-cart-model.template.html';

class ShopCartModal extends mixinBehaviors(
  [IronOverlayBehaviorImpl, I18n], PolymerElement) {

  static get template() {
    return getTemplate(view);
  }

  static get is() { return 'shop-cart-modal'; }

  static get properties() {
    return {
      withBackdrop: {
        type: Boolean,
        value: true
      }
    }
  }

  ready() {
    super.ready();
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.addEventListener('transitionend', (e) => this._transitionEnd(e));
    this.addEventListener('iron-overlay-canceled', (e) => this._onCancel(e));
  }

  _renderOpened() {
    this.restoreFocusOnClose = true;
    this.backdropElement.style.display = 'none';
    this.classList.add('opened');
  }

  _renderClosed() {
    this.classList.remove('opened');
  }

  _onCancel(e) {
    // Don't restore focus when the overlay is closed after a mouse event
    if (e.detail instanceof MouseEvent) {
      this.restoreFocusOnClose = false;
    }
  }

  _transitionEnd(e) {
    if (e.target !== this || e.propertyName !== 'transform') {
      return;
    }
    if (this.opened) {
      this._finishRenderOpened();
      this.fire('announce', 'Item added to the cart');
    } else {
      this._finishRenderClosed();
      this.backdropElement.style.display = '';
    }
  }

  get _focusableNodes() {
    return [this.$.viewCartAnchor, this.$.closeBtn];
  }

  refit() { }

  notifyResize() { }
}

customElements.define(ShopCartModal.is, ShopCartModal);
