"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.h = exports.xlinkNS = void 0;
const utils_1 = require("./utils");
exports.xlinkNS = 'http://www.w3.org/1999/xlink';
function h(tag, attrs, ...children) {
    if (typeof tag === 'function')
        return tag(Object.assign(Object.assign({}, attrs), { children }));
    const isSvg = utils_1.isSvgTag(tag);
    const element = isSvg
        ? document.createElementNS('http://www.w3.org/2000/svg', tag)
        : document.createElement(tag);
    if (attrs) {
        if (attrs.style && typeof attrs.style !== 'string') {
            utils_1.setElementStyle(element, attrs.style);
            delete attrs.style;
        }
        for (const name of Object.keys(attrs)) {
            const value = attrs[name];
            if (name.startsWith('on')) {
                const finalName = name.replace(/Capture$/, '');
                const useCapture = name !== finalName;
                const eventName = finalName.toLowerCase().substring(2);
                element.addEventListener(eventName, value, useCapture);
            }
            else if (isSvg && name.startsWith('xlink:')) {
                element.setAttributeNS(exports.xlinkNS, name, value);
            }
            else if (value === true) {
                element.setAttribute(name, name);
            }
            else if (value || value === 0) {
                element.setAttribute(name, value.toString());
            }
        }
    }
    utils_1.applyChildren(element, children);
    return element;
}
exports.h = h;
//# sourceMappingURL=h.js.map