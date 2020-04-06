// const paypal = require('paypal-checkout');
// const client = require('braintree-web/client');
// const paypalCheckout = require('braintree-web/paypal-checkout');

import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

import './shop-button.js';
import './shop-common-styles.js';
import './shop-form-styles.js';
import './shop-input.js';
import './shop-select.js';
import './shop-checkbox.js';

import { Config } from './Config';
import { getTemplate } from './getTemplate';
import * as view from './shop-checkout-paypal.template.html';

class ShopCheckout extends PolymerElement {
    static get template() {
        return getTemplate(view);
    }

    static get is() { return 'shop-checkout'; }

    static get properties() {
        return {
            /**
             * The route for the state. e.g. `success` and `error` are mounted in the
             * `checkout/` route.
             */
            route: {
                type: Object,
                notify: true
            },

            /**
             * The state of the form. Valid values are:
             * `init`, `success` and `error`.
             */
            state: {
                type: String,
                value: 'init'
            },

            /**
             * An array containing the items in the cart.
             */
            cart: Array,

            /**
             * If true, shop-checkout is currently visible on the screen.
             */
            visible: {
                type: Boolean,
                observer: '_visibleChanged'
            },

            /**
             * True when waiting for the server to repond.
             */
            waiting: {
                type: Boolean,
                readOnly: true,
                reflectToAttribute: true
            },

            /**
             * True when waiting for the server to repond.
             */
            _hasItems: {
                type: Boolean,
                computed: '_computeHasItem(cart.length)'
            },

            total: {
                type: Number
            },

            sandbox: {
                type: Boolean,
                value: Config.useSandbox,
            },
            sandboxId: {
                type: String,
                value: Config.payPalSandboxClientId,
            },
            productionId: {
                type: String,
                value: Config.payPalClientId,
            },
            currency: {
                type: String,
                value: () => {
                    return document.querySelector('shop-app').getAttribute('currency');
                },
            },
            reference: {
                type: String,
            },

            responseMessage: {
                type: String,
            },
        }
    }

    static get observers() {
        return [
            '_updateRef(cart.splices)',
            '_updateState(routeActive, routeData)',
        ]
    }

    _updateRef(cart) {
        if (this.cart) {
            this.reference = this.cart.reduce(
                (acc, entry) => acc + '"' + entry.item.title + '" ' +
                    '(' + entry.item.name + ') ' +
                    (entry.size ? ('size: ' + entry.size) : '') +
                    (entry.options ? ('options: ' + entry.options) : '') +
                    ' @ ' + entry.totalPrice +
                    '. ',
                ''
            );
            console.log('Set reference to %s', this.reference);
        }
    }

    _pushState(state) {
        this._validState = state;
        this.set('route.path', state);
    }

    /**
     * Checks that the `:state` subroute is correct. That is, the state has been pushed
     * after receiving response from the server. e.g. Users can only go to `/checkout/success`
     * if the server responsed with a success message.
     */
    _updateState(active, routeData) {
        if (active && routeData) {
            let state = routeData.state;
            if (this._validState === state) {
                this.state = state;
                this._validState = '';
                return;
            }
        }
        this.state = 'init';
    }

    /**
     * Sets the initial state.
     */
    _reset() {
        let form = this.$.checkoutForm;

        this._setWaiting(false);
        form.reset && form.reset();

        let nativeForm = form._form;
        if (!nativeForm) {
            return;
        }
    }

    _computeHasItem(cartLength) {
        return cartLength > 0;
    }

    _getEntryTotal(entry) {
        return entry.totalPrice;
        // return entry.quantity * entry.item.price;
    }

    _visibleChanged(visible) {
        if (!visible) {
            return;
        }
        // Reset the UI states
        this._reset();
        // Notify the page's title
        this.dispatchEvent(new CustomEvent('change-section', {
            bubbles: true, composed: true, detail: { title: 'Checkout' }
        }));
    }

    _onPaypalSuccess(e) {
        console.log('Enter onPaypalSuccess', e);
        this.responseMessage = 'Thank you for your order, which has now been placed. You should hear from PayPal and ourselves shortly.';
        this._pushState('success');
        this._reset();
        this.dispatchEvent(new CustomEvent('clear-cart', { bubbles: true, composed: true }));
    }

    _onPaypalError(e) {
        console.log('Enter onPaypalError', e);
        this.responseMessage = '<pre>Details: ' + JSON.stringify(e, {}, 2) + '</pre>';
        this._pushState('error');
    }
}

customElements.define(ShopCheckout.is, ShopCheckout);
