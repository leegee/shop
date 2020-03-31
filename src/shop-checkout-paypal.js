import { PolymerElement } from '@polymer/polymer/polymer-element.js';
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

import { Config } from './Config';
import { getTemplate } from './getTemplate';
import * as view from './shop-checkout-paypal.template-auto.html';

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
                reflectToAttribute: true,
                value: true,
            },
            // sandbox client id (https://developer.paypal.com/developer/applications/create)
            sandboxId: {
                type: String,
                value: Config.payPalCientId,
            },
            // production client id
            productionId: {
                type: String,
            },
            // amount currency
            currency: {
                type: String,
                value: () => {
                    return document.querySelector('shop-app').getAttribute('currency');
                },
            },
            // payment reference (optional)
            reference: {
                type: String,
            },
            // whether events bubble
            bubbles: {
                type: Boolean,
                value: false,
            },
            // the paypal response data
            response: {
                type: Object,
                notify: true,
                readonly: true,
            },
            // the iframe to render the button
            _frame: {
                type: Object,
            },
            // postMessage listener and handler
            _handler: {
                type: Object,
            },
        }
    }

    static get observers() {
        return [
            '_updateState(routeActive, routeData)',
            '_updateFrame(amount, currency, reference)',
            'open(sandbox, sandboxId, productionId, cart, currency)',
        ]
    }

    // update iframe url
    open() {
        // bail if frame isnt initialized yet
        if (!this._frame) {
            console.error('No frame');
            return;
        }
        // bail if no ids are set
        if (!this.productionId && !(this.sandbox && this.sandboxId)) {
            console.error('No Ids');
            return;
        }

        if (!this.cart || !this.cart.length) {
            console.error('No cart');
            return;
        }

        let amount = 0;

        const params = new URLSearchParams();
        params.set('env', this._env());
        params.set('sandboxId', this.sandboxId);
        params.set('productionId', this.productionId);
        params.set('amount', Number(this.total).toFixed(2));
        params.set('currency', this.currency);
        params.set('reference', this.reference);
        params.set('referer', document.location.href);

        console.warn(params.toString());

        this._frame.src = `${this.resolveUrl("paypal.html")}?${params.toString()}`;
    }

    connectedCallback() {
        // el.src = 'https://www.paypal.com/sdk/js?client-id=' + Config.payPalCientId;

        super.connectedCallback();
        this.handleParams();
        this._frame = this.$.frame;
        this._handler = this._eventHandler.bind(this);
        window.addEventListener("message", this._handler);
    }


    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("message", this._handler);
        this._frame = null;
    }

    // detect from url params if the page is a redirect from the payment flow
    async handleParams() {
        // queue as micro task
        await 0;
        let searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has("paypal-window-success")) {
            let data = {
                // map the callback url params to the api response
                paymentID: searchParams.get("paymentId"),
                paymentToken: searchParams.get("token"),
                payerID: searchParams.get("PayerID"),
            };

            this._fireSuccess(data);
            this.response = data;
        }
        if (searchParams.has("paypal-window-error")) {
            this._fireError();
        }
    }

    _updateFrame() {
        this._sendMessage('paypal-window-update', {
            amount: this.amount,
            currency: this.currency,
            reference: this.reference,
        });
    }

    _sendMessage(type, data) {
        if (this._frame) {
            this._frame.contentWindow.postMessage({
                type,
                data
            }, `${window.location.protocol}//${window.location.host}`);
        }
    }

    _fireSuccess(data) {
        /**
         * @event paypal-success Fired on succesful checkout.
         */
        this.dispatchEvent(new CustomEvent('paypal-success', {
            detail: data,
            bubbles: this.bubbles,
            composed: true,
        }));
    }

    _fireError(data) {
        /**
         * @event paypal-error Fired on paypal error or window close.
         */
        this.dispatchEvent(new CustomEvent('paypal-error', {
            detail: data,
            bubbles: this.bubbles,
            composed: true,
        }));
    }

    // data bridge recieving
    _eventHandler(event) {
        // bail for wrong origin
        if (event.origin !== `${window.location.protocol}//${window.location.host}`) { return; }

        switch (event.data.type) {
            case "paypal-window-init":
                this._sendMessage("paypal-window-init-ack");
                break;
            case "paypal-window-rendered":
                this._updateFrame();
                break;
            case "paypal-window-success":
                this._sendMessage("paypal-window-success-ack");
                this.response = event.data.data;
                this._fireSuccess(event.data.data);
                break;
            case "paypal-window-error":
                this._sendMessage("paypal-window-error-ack");
                this._fireError(event.data.data);
                break;
            case "paypal-window-close":
                this._sendMessage("paypal-window-close-ack");
                this._fireError("user closed window");
                break;
            default:
            // do nothing
        }
    }

    _env() {
        return this.sandbox ? 'sandbox' : 'production';
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
