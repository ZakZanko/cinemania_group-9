!function(){function e(e){return e&&e.__esModule?e.default:e}var t,n,r,o,c="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},i={},a={},s=c.parcelRequiref9fd;null==s&&((s=function(e){if(e in i)return i[e].exports;if(e in a){var t=a[e];delete a[e];var n={id:e,exports:{}};return i[e]=n,t.call(n.exports,n,n.exports),n.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){a[e]=t},c.parcelRequiref9fd=s),t=document.querySelector(".js-menu-container"),n=document.querySelector(".js-open-menu"),r=document.querySelector(".js-close-menu"),o=function(){var e="true"===n.getAttribute("aria-expanded")||!1;n.setAttribute("aria-expanded",!e),t.classList.toggle("is-open"),bodyScrollLock[e?"enableBodyScroll":"disableBodyScroll"](document.body)},n.addEventListener("click",o),r.addEventListener("click",o),window.matchMedia("(min-width: 768px)").addEventListener("change",(function(e){e.matches&&(t.classList.remove("is-open"),n.setAttribute("aria-expanded",!1),bodyScrollLock.enableBodyScroll(document.body))}));for(var l=window.document,d=l.querySelectorAll("a"),u=d.length,f=l.URL,p=0;p<u;p++){var v=d[p].href;f.startsWith(v)&&d[p].classList.add("active")}s("gVa74");var h=s("bpxeT"),b=s("2TvXO"),g="https://api.themoviedb.org/3",m="/trending/movie/week",y="b90b64a7e05f9e36894001e36eb3b3c7",w=document.querySelector(".js-list"),_=1;new IntersectionObserver((function(e,t){e.forEach((function(e){e.isIntersecting&&serviceMovie(_+=1).then((function(e){w.insertAdjacentHTML("beforeend",L(e.results)),e.total_pages<=e.page&&t.unobserve(guard)}))}))}),{root:null,rootMargin:"400px",threshold:0});function x(){return x=e(h)(e(b).mark((function t(){var n,r=arguments;return e(b).wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.length>0&&void 0!==r[0]?r[0]:1,e.abrupt("return",fetch("".concat(g).concat(m,"?api_key=").concat(y,"&page=").concat(n)).then((function(e){if(!e.ok)throw new Error(e.statusText);return e.json()})));case 2:case"end":return e.stop()}}),t)}))),x.apply(this,arguments)}function L(e){return e.slice(0,3).map((function(e){var t=e.original_title,n=e.poster_path,r=e.release_date,o=e.genre;return"<li class='cards-list-item'>\n       <img class='cards__list-img' src=\"https://image.tmdb.org/t/p/w400".concat(n,'" alt="').concat(t,"\">\n       <div class='weekly-trends__overlay'></div>\n       <div class='cards__bloc-stars'>\n     <h2 class='cards__list-title'>").concat(t,"</h2>\n     <div class='cards__list-text'>").concat(o," | ").concat(r.slice(0,4),"</div> \n</div></li>")})).join("")}(function(){return x.apply(this,arguments)})().then((function(e){w.insertAdjacentHTML("beforeend",L(e.results))})).catch((function(e){return console.log(e)}))}();
//# sourceMappingURL=index.fdf8b1a0.js.map
