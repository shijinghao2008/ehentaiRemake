// ==UserScript==
// @name         ehentaiRemake
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ehentai网页端界面重做
// @author       Shi
// @match        https://e-hentai.org/*
// @updateURL    https://raw.githubusercontent.com/shijinghao2008/ehentaiRemake/master/ehentaiRemake.js?token=GHSAT0AAAAAACPRXZEHEHKAYZ6BMFBLWLAEZQFP5OQ
// @downloadURL  https://raw.githubusercontent.com/shijinghao2008/ehentaiRemake/master/ehentaiRemake.js?token=GHSAT0AAAAAACPRXZEHEHKAYZ6BMFBLWLAEZQFP5OQ
// @grant        GM_addStyle
// ==/UserScript==


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