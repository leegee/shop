import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Config } from './Config';
import { I18n } from './shop-i18n';

class ShopCategoryData extends I18n(PolymerElement) {

  static get is() { return 'shop-category-data'; }

  static get matchKeys() {
    return /^gsx\$(.+)$/;
  }

  static get properties() {
    return {
      categoryName: String,
      itemName: String,
      categories: {
        type: Array,
        value: Config.categoryList,
        readOnly: true,
        notify: true
      },
      category: {
        type: Object,
        computed: '_computeCategory(categoryName)',
        notify: true
      },
      item: {
        type: Object,
        computed: '_computeItem(category.items, itemName)',
        notify: true
      },
      failure: {
        type: Boolean,
        notify: true,
        readOnly: true
      }
    }
  }

  _getCategoryObject(categoryName) {
    for (let i = 0, c; c = this.categories[i]; ++i) {
      if (c.name === categoryName) {
        return c;
      }
    }
  }

  _computeCategory(categoryName) {
    // Fetch the items of the category. Note that the fetch is asynchronous,
    // which means `category.items` may not be set initially (but that path
    // will be notified when the fetch completes).
    let categoryObj = this._getCategoryObject(categoryName);
    this._fetchItems(categoryObj, 1);
    return categoryObj;
  }

  _computeItem(items, itemName) {
    if (!items || !itemName) {
      return;
    }
    for (let i = 0, item; item = items[i]; ++i) {
      if (item.name === itemName) {
        return item;
      }
    }
  }

  _reformatJson(googleSheetsJson, category) {
    console.debug('Load category', category);
    const headers = googleSheetsJson.values[0];
    const rv = [];
    googleSheetsJson.values
      .splice(1) // Ignore header row
      .filter(row => row.length) // Ignore blank rows
      .forEach(shopItems => { // Convert array to object based on 'headers'
        const item = shopItems.reduce((result, value, index) => {
          if (value) {
            if (headers[index].match(/^(price|options|sizes|quantities)$/) && value.indexOf(',') > -1) {
              value = value.split(/\s*,\s*/);
            }
            if (headers[index].match(/^(price|sizes|quantities)$/)) {
              if (value instanceof Array) {
                value = value.map(_ => Number(_));
              } else {
                value = Number(value);
              }
            }
          }
          result[headers[index]] = value;
          return result;
        }, {});

        item.categoryName = category.name;
        rv.push(item);

      });
    return rv;
  }

  _fetchItems(category, attempts) {
    this._setFailure(false);
    // Only fetch the items of a category if it has not been previously set.
    if (!category || category.items) {
      return;
    }
    this._getResource({
      category: category,
      onLoad(json) {
        this.set('category.items', json);
      },
      onError(e) {
        this._setFailure(true);
      }
    }, attempts);
  }

  _getResource(req, attempts) {
    if (!req.category || !req.category.sheetName) {
      console.error(req);
      throw new TypeError('Expected a category with sheetName in parameter 1');
    }
    const url = Config.getGoogleSheetsUrlForSheetName(req.category.sheetName);
    console.log('Fetching shop cat data from', url);
    fetch(url)
      .then(res => {
        console.log('Fetched ', url);
        return res.json();
      })
      .then(json => {
        return this._reformatJson(json, req.category);
      })
      .then(json => {
        req.onLoad.bind(this)(json);
      })
      .catch(e => {
        // Flaky connections might fail fetching resources
        console.warn(e);
        if (attempts > 1) {
          this._getResourceDebouncer = Debouncer.debounce(this._getResourceDebouncer,
            timeOut.after(500), this._getResource.bind(this, req, attempts - 1));
        } else {
          req.onError.call(this, e);
        }
      })
  }

  refresh() {
    if (this.categoryName) {
      // Try at most 3 times to get the items.
      this._fetchItems(this._getCategoryObject(this.categoryName), 3);
    }
  }

  parseGsx(gsx) {
    const rv = [];
    gsx.feed.entry.forEach(entry => {
      const reformed = {};
      Object.keys(entry).forEach(key => {
        let m;
        if (m = key.match(this.matchKeys)) {
          reformed[m[1]] = entry['$t'];
        }
      });
      rv.push(reformed);
    });
    console.log('parsed', rv);
    return rv;
  }

}

customElements.define(ShopCategoryData.is, ShopCategoryData);
