import { Config } from './Config';

class ShopAnalytics extends HTMLElement {
  connectedCallback() {
    // track metrics with google analytics...
    if (Config.googleAnalyticsKey) {
      (function (window, document, nodeName, url, varName, a, m) {
        window['GoogleAnalyticsObject'] = varName;
        window[varName] = window[varName] || function () {
          (window[varName].q = window[varName].q || []).push(arguments)
        }, window[varName].l = 1 * new Date();
        a = document.createElement(nodeName),
          m = document.getElementsByTagName('body')[0];
        a.async = 1;
        a.src = url;
        m.parentNode.insertBefore(a, m);
      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
      ga('create', Config.googleAnalyticsKey, 'auto');
      ga('send', 'pageview');
    }
  }
}

if (Config.googleAnalyticsKey) {
  customElements.define('shop-analytics', ShopAnalytics);
}
