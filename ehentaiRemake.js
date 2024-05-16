// ==UserScript==
// @name         ehentaiRemake
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ehentai网页端界面重做
// @author       Shi
// @match        https://e-hentai.org/*
// @updateURL    https://raw.githubusercontent.com/shijinghao2008/ehentaiRemake/master/ehentaiRemake.js
// @downloadURL  https://raw.githubusercontent.com/shijinghao2008/ehentaiRemake/master/ehentaiRemake.js
// @grant        GM_addStyle
// ==/UserScript==
// FORMERTODO: 先把字放大，把图片盛满整个div，来作为第一版实验品
// 最后发现在object-fit: contain的基础上设置长款大小就可以，图片会自动调整另外一项

(function() {
    'use strict';

    let galleries = [];
    let galleriesHTML = '';
    let styleHTML = '';
    let starSVGId = 0;

    function collectGalleryInformation() {
        document.querySelectorAll('.gl1t').forEach(gallery => {
            let galleryInfo = {
                galleryUrl: gallery.querySelector('a').href,
                title: gallery.querySelector('.gl4t').textContent,
                coverImageSrc: gallery.querySelector('img').src,
                tags: [],
                type: {
                    typeContent: gallery.querySelector('.cs').textContent,
                    onclick: gallery.querySelector('.cs').getAttribute('onclick'),
                    backgroundColor: "",
                },
                rating: 0,
                pageCount: 0,
                favorite:{
                    color: gallery.querySelector('.cs').nextElementSibling.style.borderColor,
                    title: gallery.querySelector('.cs').nextElementSibling.title,
                    id: gallery.querySelector('.cs').nextElementSibling.id,
                    onclick: gallery.querySelector('.cs').nextElementSibling.getAttribute('onclick'),
                },
                uploadTime: gallery.querySelector('.cs').nextElementSibling.textContent
            };
            console.log(galleryInfo.title+" color:  "+galleryInfo.favorite.color);
            // 根据位置判断画廊星级
            let backgroundPositionStr = gallery.querySelector('.ir').style.backgroundPosition;
            let positions = backgroundPositionStr.split(' ');
            let xPosition = parseInt(positions[0], 10);
            let yPosition = parseInt(positions[1], 10);
            let rating = 0;
            switch(xPosition) {
                case -80:
                    rating = 0;
                    break;
                case -64:
                    rating = 1;
                    break;
                case -48:
                    rating = 2;
                    break;
                case -32:
                    rating = 3;
                    break;
                case -16:
                    rating = 4;
                    break;
                case 0:
                    rating = 5;
                    break;
                default:
                    console.log('未知的xPosition值');
            }
            switch(yPosition){
                case -21:
                    rating -= 0.5;
                    break;
                case -1:
                    break;
                default:
                    console.log('未知的yPosition值');
            }
            galleryInfo.rating = rating;

            // 读取画廊页数
            let pageElement = gallery.querySelector('.ir').nextElementSibling;
            galleryInfo.pageCount = parseInt(pageElement.textContent, 10);

            // 设置画廊类型标签颜色
            switch (galleryInfo.type.typeContent) {
                case "Doujinshi":
                    galleryInfo.type.backgroundColor = "#fc4e4f";
                    break;
                case "Manga":
                    galleryInfo.type.backgroundColor = "#fdb417";
                    break;
                case "Artist CG":
                    galleryInfo.type.backgroundColor = "#dee501";
                    break;
                case "Game CG":
                    galleryInfo.type.backgroundColor = "#06bf0a";
                    break;
                case "Western":
                    galleryInfo.type.backgroundColor = "#14e824";
                    break;
                case "Non-H":
                    galleryInfo.type.backgroundColor = "#68c8de";
                    break;
                case "Image Set":
                    galleryInfo.type.backgroundColor = "#5050d6";
                    break;
                case "Cosplay":
                    galleryInfo.type.backgroundColor = "#9755f5";
                    break;
                case "Asian Porn":
                    galleryInfo.type.backgroundColor = "#fe92ff";
                    break;
                case "Misc":
                    galleryInfo.type.backgroundColor = "#9e9e9e";
                    break;
                default:
                    console.log("未知的画廊类型");
                    break;
            }

            gallery.querySelectorAll('.gt').forEach(tag => {
                // 存储每个标签的内容和背景颜色
                galleryInfo.tags.push({
                    content: tag.textContent, // 存储标签的文本内容
                    title: tag.title, // 存储标签的搜索值
                    textColor: tag.style.color, // 存储标签的文字颜色
                    borderColor: tag.style.borderColor, // 存储标签的边框颜色
                    background: tag.style.background // 存储标签的背景样式
                });
            });

            galleries.push(galleryInfo);
        });
    }

    collectGalleryInformation();

    function insertStyle() {
        styleHTML = `
.pagebody{
    background:#EDEBDF;
    border:1px solid #000000;
    max-width:1800px;
    margin:10px auto 5px;
    padding:5px;
    position:relative;
    border-radius:9px;
}

.glgrid{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.glbox{
    width: 300px;
    padding: 10px;
    transform-origin: top left;
}

.glbubble{
    padding: 0 0 5px 0;
    display:flex;
    flex-direction:column;
    border-radius: 20px;
    overflow: hidden;
    box-shadow:0 1px 3px rgba(0,0,0,.3);
}

.glcover {
    align-items: center;
    object-fit: contain;
}

.glcover img {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
}

.glmisc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    vertical-align: middle;
    padding: 2px 6px 2px 6px;
}

.right-aligned {
    display: flex;
    column-gap: 5px;
    vertical-align: middle;
}

.glfavorite{
    padding: 0;
    margin: 0;
    cursor:pointer;
}

.heart{
    margin: 0;
    padding: 0;
    width:20px;
    height:20px;
}

.glrating{
    padding: 0;
    margin: 0;
}

.star{
    margin: 0;
    padding: 0;
    width:20px;
    height:20px;
}

.glmisc, .glrating, .right-aligned, .glfavorite, .gltype, .glpagecount {
    height: 20px; /* 统一高度 */
    line-height: 20px; /* 确保文本垂直居中 */
}

a.glurl {
    text-decoration: none; /* 移除下划线 */
    color: inherit; /* 链接颜色与周围文本一致 */
}

a.glurl:hover {
    color:#8F4701;
}

.gltitle{
    padding: 4px 6px 4px 6px;
}

.gltype[data-disabled],.cn[data-disabled],.cw[data-disabled]{
    opacity:0.4;
}

.gltype[data-disabled]:hover,.cn[data-disabled]:hover,.cw[data-disabled]:hover{
    opacity:0.6;
}

.gltype:not([data-disabled]):hover,.cn:not([data-disabled]):hover,.cw:not([data-disabled]):hover{
    opacity:0.8;
}

.gltype{
    user-select:none;
    display:inline-block;
    text-align:center;
    vertical-align:middle;
    white-space:nowrap;
    height: 18px;
    line-height: 18px;
    padding: 1px 4px;
    font-size:9pt;
    border-radius:5px;
    color:#f1f1f1;
    box-shadow:0 1px 3px rgba(0,0,0,.3);
    text-shadow:2px 2px 3px rgba(0,0,0,.3);
    letter-spacing:1px;
    font-weight:bold;
    cursor:pointer;
}

.glpagecount {
    height: 20px;
}

.gltags {
    padding: 2px 4px 2px 4px;
}

.gltag {
    float: left;
    font-weight: bold;
    padding: 1px 4px;
    margin: 2px;
    position: relative;
    border-radius: 7px;
    font-size:14px;
    border: 1px solid #806769;
    background: #F2EFDF;
    max-width:250px;
    white-space:nowrap;
    text-overflow: ellipsis;   /* 当文本超出元素宽度时，末尾用省略号(...)表示 */
    overflow: hidden;          /* 隐藏超出元素容器范围的内容 */
}

    `;
    }

    // 定义一个函数来创建星星的SVG图形
    function createStarSVG(fillRatio) {
        const starColor = 'gold';
        let starHTML = `<svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="star${starSVGId}">
          <stop offset="${fillRatio * 100}%" stop-color="${starColor}"/>
          <stop offset="${fillRatio * 100}%" stop-color="gray"/>
        </linearGradient>
      </defs>
      <path fill="url(#star${starSVGId})" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>`;
        starSVGId += 1;
        return starHTML;
    }

    // 创建星级显示的HTML
    function createStarRatingHTML(rating) {
        let html = '';
        for (let i = 0; i < 5; i++) {
            const fillRatio = Math.min(Math.max(rating - i, 0), 1);
            html += createStarSVG(fillRatio);
        }
        return html;
    }

    function createHeartSVG(color) {
        if (color===''){
            color = '#FFFFFF';
        }
        return `<svg class="heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="${color}" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
</svg>`;
    }

    function buildGalleries() {
        galleries.forEach(gallery => {
            let tagHTML = "";
            gallery.tags.forEach(tag => {
                tagHTML += `
            <div class="gltag" style="color: ${tag.textColor};border-color: ${tag.borderColor};background: ${tag.background};" title="${tag.title}">${tag.content}</div>
            `;
            });

            galleriesHTML += `
        <div class="glbox">
            <div class="glbubble">
                <div class="glcover">
                    <a href="${gallery.galleryUrl}">
                        <img alt="${gallery.title}" title="${gallery.title}" src="${gallery.coverImageSrc}"> <!-- 封面图片 -->
                    </a>
                </div>
                <div class="glmisc">
                    <div class="glrating">${createStarRatingHTML(gallery.rating)}</div>
                    <div class="right-aligned">
                        <div class="glfavorite" id="${gallery.favorite.id}" title="${gallery.favorite.title}" onclick="${gallery.favorite.onclick}">${createHeartSVG(gallery.favorite.color)}</div>
                        <div class="gltype" onclick="${gallery.type.onclick}" style="background-color: ${gallery.type.backgroundColor}">${gallery.type.typeContent}</div>
                        <div class="glpagecount">${gallery.pageCount}P</div>
                    </div>
                </div>
                <a class="glurl" href="${gallery.galleryUrl}">
                    <div class="gltitle">${gallery.title}</div>
                </a>
                <div class="gltags">
                    ${tagHTML}
                </div>
            </div>
        </div>
        `;
        });
    }

    function insertPage() {
        buildGalleries();
        insertStyle();

        const newPage = `
        <html>
            <head>  
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${document.querySelector("title").textContent}</title>
                <style>
                    ${styleHTML}
                </style>
            </head>
            <body>
                <article>
                    <div class="pagebody">
                        <div class="glgrid">
                            ${galleriesHTML}
                        </div>
                    </div>
                </article>
            </body>
        </html>
        `;

        const html = newPage;
        document.documentElement.innerHTML = html;

        // 在插入新页面后，调整瀑布流布局
        window.addEventListener('resize', adjustMasonryLayout);
        // 等待所有图片加载完成后调整布局
        waitForImages();
    }

    let timeout;
    function adjustMasonryLayoutThrottled() {
        clearTimeout(timeout);
        timeout = setTimeout(adjustMasonryLayout, 100); // 延迟100毫秒执行，合并短时间内的多次调用
    }


    function waitForImages() {
        const images = document.querySelectorAll('.glcover img');
        images.forEach(img => {
            img.addEventListener('load', adjustMasonryLayoutThrottled);  // 每次图片加载后调用调整布局函数
            img.addEventListener('error', adjustMasonryLayoutThrottled); // 图片加载失败也调用调整布局函数
        });
    }


    function adjustMasonryLayout() {
        const grid = document.querySelector('.glgrid');
        const boxes = Array.from(grid.children);
        const gridWidth = grid.clientWidth;
        const boxWidth = boxes[0].offsetWidth;
        const boxHeight = boxes[0].offsetHeight;
        // 使用固定的最大列数
        const maxColumns = 6;
        const minColumns = 2;
        const columnChangeThreshold = 50; // 设置一个阈值，防止频繁切换

        let columnCount = 6;

        // 计算列数，保证在1到最大列数之间
        // let columnCount = Math.floor(gridWidth / boxWidth);
        // columnCount = Math.max(minColumns, Math.min(maxColumns, columnCount));

        // 宽度区间          列数     box宽度
        // 0-600			2		0-300
        // 600-800			3		200-267
        // 800-1200			4		200-300
        // 1200-1500		5		240-300
        // 1500-1800		6		250-300
        if (gridWidth>=1500){
            columnCount = 6;
        }else if (gridWidth >= 1200){
            columnCount = 5;
        }else if (gridWidth >= 800){
            columnCount = 4;
        }else if (gridWidth >= 600){
            columnCount = 3;
        }else{
            columnCount = 2;
        }

        // 根据列数计算缩放比例
        const scale = Math.min(1, gridWidth / (columnCount * boxWidth));

        console.log(`gridWidth: ${gridWidth}`);
        console.log(`boxWidth: ${boxWidth}`);
        console.log(`columnCount: ${columnCount}`);
        console.log(gridWidth / (columnCount * boxWidth))
        console.log(`scale: ${scale}`);
        console.log(`devicePixelRatio: ${window.devicePixelRatio}`);
        console.log(`窗口宽度（CSS像素）: ${document.documentElement.clientWidth}`);
        console.log(`窗口高度（CSS像素）: ${document.documentElement.clientHeight}`);



        const columnHeights = new Array(columnCount).fill(0);

        boxes.forEach(box => {
            box.style.transform = `scale(${scale})`;
            const minHeight = Math.min(...columnHeights);
            const columnIndex = columnHeights.indexOf(minHeight);

            box.style.position = 'absolute';
            box.style.top = `${minHeight}px`;
            box.style.left = `${(columnIndex * boxWidth) * scale}px`;

            columnHeights[columnIndex] += box.offsetHeight * scale;
        });

        grid.style.position = 'relative';
        grid.style.height = `${Math.max(...columnHeights) / scale}px`;
    }

    window.addEventListener('resize', adjustMasonryLayout);
    window.addEventListener('DOMContentLoaded', adjustMasonryLayout);





    if (galleries.length !== 0){
        insertPage();
    }

})();
