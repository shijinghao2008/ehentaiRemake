// ==UserScript==
// @name         ehentaiRemake
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ehentai网页端界面重做
// @author       Shi
// @match        https://e-hentai.org/*
// @updateURL    https://raw.githubusercontent.com/shijinghao2008/ehentaiRemake/master/ehentaiRemake.js
// @downloadURL  https://raw.githubusercontent.com/shijinghao2008/ehentaiRemake/master/ehentaiRemake.js
// @grant        GM_addStyle
// ==/UserScript==
// FORMERTODO: 先把字放大，把图片盛满整个div，来作为第一版实验品
// 最后发现在object-fit: contain的基础上设置长款大小就可以，图片会自动调整另外一项


function insertPage() {
    const newPage = `
      <html>
      <head>  
        <title>{{title}}</title>
        <style>
          /* 自定义样式 */
        </style>
      </head>
      <body>
        <article>
          <h1>{{title}}</h1>
          {{content}}
        </article>
      </body>
      </html>
    `;

    const html = newPage;
    document.documentElement.innerHTML = html;
}