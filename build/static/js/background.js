!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=30)}({1:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(3);function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var c,u=e[Symbol.iterator]();!(r=(c=u.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(a){o=!0,i=a}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}}(e,t)||Object(r.a)(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},2:function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}n.d(t,"a",(function(){return i}))},3:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(4);function o(e,t){if(e){if("string"===typeof e)return Object(r.a)(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(r.a)(e,t):void 0}}},30:function(e,t,n){"use strict";n.r(t);var r=n(1),o=n(2);function i(e){chrome.storage.sync.get({actionSpecs:[]},(function(t){var n=t.actionSpecs;return e(n)}))}function c(e){chrome.storage.sync.set({actionSpecs:e})}chrome.management.onInstalled.addListener((function(e){var t=e.id;chrome.runtime.sendMessage(t,{type:"action spec"},(function(e){return function(e){if(void 0===e.id||void 0===e.name||void 0===e.actions)return;i((function(t){console.debug("---begin storeActionSpec---"),console.debug(t);var n=t.findIndex((function(t){return e.id===t.id}));n>-1?t[n]=e:t.unshift(e),c(t),console.debug("---end storeActionSpec---")}))}(Object(o.a)(Object(o.a)({id:t},e),{},{installedAt:(new Date).toISOString()}))}))})),chrome.runtime.onMessageExternal.addListener((function(e,t){switch(console.debug("incoming external request: ",e),e.type){case"select":n=t.id,o=e.hint,i=e.options,chrome.tabs.query({active:!0,currentWindow:!0},(function(e){var t=Object(r.a)(e,1)[0];chrome.tabs.sendMessage(t.id,{type:"select",senderId:n,hint:o,options:i})}))}var n,o,i})),chrome.runtime.onInstalled.addListener((function(){i((function(e){var t=e.filter((function(e){var t=e.id,n=e.name,r=e.actions;return void 0!==t&&void 0!==n&&void 0!==r}));console.debug(t),c(t)}))})),chrome.runtime.onConnect.addListener((function(e){var t=e.name,n=e.onMessage;"ActHub"==t&&n.addListener((function(e){console.log(e),console.log("Thanks, content.js -- received in background.js")}))}))},4:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}n.d(t,"a",(function(){return r}))}});
//# sourceMappingURL=background.js.map