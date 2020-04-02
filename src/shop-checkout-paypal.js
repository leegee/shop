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

            // whether to use sandbox mode
            sandbox: {
                type: Boolean,
                value: Config.useSandbox,
            },
            // // sandbox client id (https://developer.paypal.com/developer/applications/create)
            sandboxId: {
                type: String,
                value: Config.payPalSandboxClientId,
            },
            // production client id
            productionId: {
                type: String,
                value: Config.payPalClientId,
            },
            // amount currency
            currency: {
                type: String,
                value: () => {
                    return document.querySelector('shop-app').getAttribute('currency');
                },
            },
        }
    }

    static get observers() {
        return [
            '_updateState(routeActive, routeData)',
        ]
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

    _addPayPal() {
        // const el = document.createElement('script');
        // el.src = "https://www.paypal.com/sdk/js?client-id=" + Config.payPalSandboxClientId;
        // el.onload = () => window.paypal.Buttons().render('#paypal-area');
        // document.head.appendChild(el);
        // const topLevel = document.querySelector('body /deep/ #paypal-area');
        // window.paypal.Buttons().render('#paypal-area');
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


    /**
     * Adds the cart data to the payload that will be sent to the server
     * and updates the UI to reflect the waiting state.
     */
    _willSendRequest(e) {
        console.log('Enter _willSendRequest');
        debugger;
        let form = e.target;
        let body = form.request && form.request.body;

        this._setWaiting(true);

        if (!body) {
            return;
        }
        // Populate the request body where `cartItemsId[i]` is the ID and `cartItemsQuantity[i]`
        // is the quantity for some item `i`.
        body.cartItemsId = [];
        body.cartItemsQuantity = [];

        this.cart.forEach((cartItem) => {
            body.cartItemsId.push(cartItem.item.name);
            body.cartItemsQuantity.push(cartItem.quantity);
        });
    }

    /**
     * Handles the response from the server by checking the response status
     * and transitioning to the success or error UI.
     */
    _didReceiveResponse(e) {
        let response = e.detail.response;

        this.response = response;
        this._setWaiting(true);

        if (response.success) {
            this._pushState('success');
            this._reset();
            this.dispatchEvent(new CustomEvent('clear-cart', { bubbles: true, composed: true }));
        } else {
            this._pushState('error');
        }
    }

    _computeHasItem(cartLength) {
        return cartLength > 0;
    }

    _getEntryTotal(entry) {
        return entry.quantity * entry.item.price;
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

}

customElements.define(ShopCheckout.is, ShopCheckout);
