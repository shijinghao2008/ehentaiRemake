// ==UserScript==
// @name         My Custom Stylesheet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply custom styles to a specific website
// @author       Your Name
// @match        http://example.com/*
// @grant        GM_addStyle
// ==/UserScript==

// (function() {
//     'use strict';
//
//     GM_addStyle(`
//         /* 在这里编写你的 CSS 代码 */
//         body {
//             font-family: Arial, sans-serif;
//             font-size: 18px;
//         }
//
//         p, li {
//             line-height: 1.6;
//         }
//
//         a {
//             color: #0066cc;
//         }
//     `);
//
// })();

function addStyle() {
    'use strict';

    GM_addStyle(`
        /* 在这里编写你的 CSS 代码 */
        body {
            font-family: Arial, sans-serif;
            font-size: 18px;
        }

        p, li {
            line-height: 1.6;
        }

        a {
            color: #0066cc;
        }
    `);
}

addStyle();