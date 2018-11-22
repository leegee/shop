import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './shop-button.js';
import './shop-common-styles.js';
import './shop-form-styles.js';
import './shop-input.js';
import './shop-select.js';
import './shop-checkbox.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

import './shop-currency.js';
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
             * The total price of the contents in the user's cart.
             */
            total: Number,

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
             * The server's response.
             */
            response: Object,

            /**
             * If true, the user must enter a billing address.
             */
            hasBillingAddress: {
                type: Boolean,
                value: false
            },

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
            }

        }
    }

    static get observers() {
        return [
            '_updateState(routeActive, routeData)'
        ]
    }

    _submit(e) {
        console.log('Enter _submit');
        // https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/formbasics/#form-attributes--action-and-method
        if (this._validateForm()) {
            console.log('_validateForm');
            // To send the form data to the server:
            // 2) Remove the code below.
            // 3) Uncomment `this.$.checkoutForm.submit()`.

            this.$.checkoutForm.dispatchEvent(new CustomEvent('iron-form-presubmit', {
                composed: true
            }));

            this._submitFormDebouncer = Debouncer.debounce(this._submitFormDebouncer,
                timeOut.after(1000), () => {
                    this.$.checkoutForm.dispatchEvent(new CustomEvent('iron-form-response', {
                        composed: true, detail: {
                            response: {
                                success: 1,
                                successMessage: 'Demo checkout process complete.'
                            }
                        }
                    }));
                });

            // this.$.checkoutForm.submit();
        }
        console.log('leave _submit');
    }

    /**
     * Sets the valid state and updates the location.
     */
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

        // Remove the `aria-invalid` attribute from the form inputs.
        for (let el, i = 0; el = nativeForm.elements[i], i < nativeForm.elements.length; i++) {
            el.removeAttribute('aria-invalid');
        }
    }

    /**
     * Validates the form's inputs and adds the `aria-invalid` attribute to the inputs
     * that don't match the pattern specified in the markup.
     */
    _validateForm() {
        let form = this.$.checkoutForm;
        let firstInvalid = false;
        let nativeForm = form._form;

        for (let el, i = 0; el = nativeForm.elements[i], i < nativeForm.elements.length; i++) {
            if (el.checkValidity()) {
                el.removeAttribute('aria-invalid');
            } else {
                if (!firstInvalid) {
                    // announce error message
                    if (el.nextElementSibling) {
                        this.dispatchEvent(new CustomEvent('announce', {
                            bubbles: true, composed: true,
                            detail: el.nextElementSibling.getAttribute('error-message')
                        }));
                    }
                    if (el.scrollIntoViewIfNeeded) {
                        // safari, chrome
                        el.scrollIntoViewIfNeeded();
                    } else {
                        // firefox, edge, ie
                        el.scrollIntoView(false);
                    }
                    el.focus();
                    firstInvalid = true;
                }
                el.setAttribute('aria-invalid', 'true');
            }
        }
        return !firstInvalid;
    }

    /**
     * Adds the cart data to the payload that will be sent to the server
     * and updates the UI to reflect the waiting state.
     */
    _willSendRequest(e) {
        console.log('Enter _willSendRequest');
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

    _toggleBillingAddress(e) {
        this.hasBillingAddress = e.target.checked;

        if (this.hasBillingAddress) {
            this.$.billAddress.focus();
        }
    }

    _computeHasItem(cartLength) {
        return cartLength > 0;
    }

    _getEntryTotal(entry) {
        console.log('set total to', entry);
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
