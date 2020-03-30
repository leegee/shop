import { Config } from './Config';

class ShopAnalytics extends HTMLElement {
  connectedCallback() {
    // track metrics with google analytics...
    if (Config.googleAnalyticsKey) {
      (function (varName, a) {
        window['GoogleAnalyticsObject'] = varName;
        window[varName] = window[varName] || function () {
          (window[varName].q = window[varName].q || []).push(arguments)
        },
          window[varName].l = 1 * new Date();
        a = document.createElement('script');
        a.async = 1;
        a.src = '//www.google-analytics.com/analytics.js';
        document.head.appendChild(a);
      })('ga');
      ga('create', Config.googleAnalyticsKey, 'auto');
      ga('send', 'pageview');
    }
  }
}

customElements.define('shop-analytics', ShopAnalytics);
