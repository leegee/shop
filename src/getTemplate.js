import { html } from '@polymer/polymer/polymer-element';

/**
 *
 *   import { getTemplate } from './getTemplate';
 *   import * as view from './component.template.html 
 *   static get template() {
 *     return getTemplate(view);
 *   }
 * 
 * @param {string} view - path to the hTML template file
 */
export const getTemplate = (view) => {
    const stringArray = [`${view}`];
    return html({ raw: stringArray, ...stringArray }
        // as TemplateStringsArray
    );
}
