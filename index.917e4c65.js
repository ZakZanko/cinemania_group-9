var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},s=e.parcelRequiref9fd;null==s&&((s=function(e){if(e in t)return t[e].exports;if(e in n){var s=n[e];delete n[e];var o={id:e,exports:{}};return t[e]=o,s.call(o.exports,o,o.exports),o.exports}var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){n[e]=t},e.parcelRequiref9fd=s),(()=>{const e=document.querySelector(".js-menu-container"),t=document.querySelector(".js-open-menu"),n=document.querySelector(".js-close-menu"),s=()=>{const n="true"===t.getAttribute("aria-expanded")||!1;t.setAttribute("aria-expanded",!n),e.classList.toggle("is-open");bodyScrollLock[n?"enableBodyScroll":"disableBodyScroll"](document.body)};t.addEventListener("click",s),n.addEventListener("click",s),window.matchMedia("(min-width: 768px)").addEventListener("change",(n=>{n.matches&&(e.classList.remove("is-open"),t.setAttribute("aria-expanded",!1),bodyScrollLock.enableBodyScroll(document.body))}))})();const o=window.document,a=o.querySelectorAll("a"),i=a.length,r=o.URL;for(let e=0;e<i;e++){let t=a[e].href;r.startsWith(t)&&a[e].classList.add("active")}const l={switchIcon:document.getElementById("switch-icon"),body:document.querySelector("body"),iconDay:document.querySelector(".icon-day"),iconNight:document.querySelector(".icon-night"),headerLogoText:document.querySelector(".header-logo-text"),homeLink:document.getElementById("home-day"),catalogLink:document.getElementById("catalog-day"),myLiberyLink:document.getElementById("my-libery-day"),menuLink:document.getElementById("menu-link"),weeklyTrend:document.getElementById("weekly-trend")};l.switchIcon.addEventListener("click",(function(){l.body.classList.toggle("bkg-white"),l.switchIcon.classList.toggle("icon-day"),l.switchIcon.classList.toggle("icon-night"),l.weeklyTrend.classList.toggle("weekly-trend-day"),l.catalogLink.classList.toggle("menu-link-day"),l.homeLink.classList.toggle("menu-link-day"),l.myLiberyLink.classList.toggle("menu-link-day"),l.menuLink.classList.toggle("menu-link-day"),l.headerLogoText.classList.toggle("day-logo-text");const e=l.body.classList.contains("bkg-white");c("background",e)})),window.addEventListener("DOMContentLoaded",(function(){d("background")?(l.weeklyTrend.classList.add("weekly-trend-day"),l.catalogLink.classList.add("menu-link-day"),l.homeLink.classList.add("menu-link-day"),l.myLiberyLink.classList.add("menu-link-day"),l.menuLink.classList.add("menu-link-day"),l.body.classList.add("bkg-white"),l.headerLogoText.classList.add("day-logo-text"),l.switchIcon.classList.add("icon-day"),l.switchIcon.classList.remove("icon-night")):(l.weeklyTrend.classList.remove("weekly-trend-day"),l.catalogLink.classList.remove("menu-link-day"),l.homeLink.classList.remove("menu-link-day"),l.myLiberyLink.classList.remove("menu-link-day"),l.menuLink.classList.remove("menu-link-day"),l.switchIcon.classList.remove("icon-day"),l.switchIcon.classList.add("icon-night"),l.headerLogoText.classList.remove("day-logo-text"))}));const c=(e,t)=>{try{const n=JSON.stringify(t);localStorage.setItem(e,n)}catch(e){console.error("Set state error: ",e.message)}},d=e=>{try{const t=localStorage.getItem(e);return null===t?void 0:JSON.parse(t)}catch(e){console.error("Get state error: ",e.message)}},u=document.querySelector(".js-list");let m=1;new IntersectionObserver((function(e,t){e.forEach((e=>{e.isIntersecting&&(m+=1,serviceMovie(m).then((e=>{u.insertAdjacentHTML("beforeend",g(e.results)),e.total_pages<=e.page&&t.unobserve(guard)})))}))}),{root:null,rootMargin:"400px",threshold:0});function g(e){return e.slice(0,3).map((({original_title:e,poster_path:t,release_date:n,genre:s})=>`<li class='cards-list-item'>\n       <img class='cards__list-img' src="https://image.tmdb.org/t/p/w400${t}" alt="${e}">\n       <div class='weekly-trends__overlay'></div>\n       <div class='cards__bloc-stars'>\n     <h2 class='cards__list-title'>${e}</h2>\n     <div class='cards__list-text'>${s} | ${n.slice(0,4)}</div> \n</div></li>`)).join("")}(async function(e=1){return fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=b90b64a7e05f9e36894001e36eb3b3c7&page=${e}`).then((e=>{if(!e.ok)throw new Error(e.statusText);return e.json()}))})().then((e=>{u.insertAdjacentHTML("beforeend",g(e.results))})).catch((e=>console.log(e))),s("bTcpz");var y=s("2shzp"),p=s("9fyS7");const h=document.querySelector(".container"),L=document.querySelector(".library-button");let f;L.addEventListener("click",(function(){const e=JSON.parse(localStorage.getItem("librariesKey"))||[],t=f.id;if(function(e){return(JSON.parse(localStorage.getItem("librariesKey"))||[]).some((t=>t.id===e))}(t)){const n=e.findIndex((e=>e.id===t));e.splice(n,1),localStorage.setItem("librariesKey",JSON.stringify(e)),L.textContent="Add to my library"}else e.push(f),localStorage.setItem("movie-info",JSON.stringify(e)),L.textContent="Remove from my library"})),async function(){const e=(await y.default.get("https://api.themoviedb.org/3/movie/upcoming?language=en-US",{params:{api_key:p.KEY}})).data,t=Math.floor(Math.random()*e.results.length);return e.results[t]}().then((e=>{f=e,async function(e){const t=(await async function(e){const t=await y.default.get("https://api.themoviedb.org/3/genre/movie/list?language=en",{params:{api_key:p.KEY}});let n=[];const s=t.data.genres;for(const t of s)e.genre_ids.includes(t.id)&&n.push(t.name);return n}(e).then((e=>e))).map(((e,t)=>0===t?e.charAt(0).toUpperCase()+e.slice(1):e.toLowerCase())).join(", "),n=e.release_date.split("-"),s=`${n[2]}.${n[1]}.${n[0]}`,o=`<img src="https://image.tmdb.org/t/p/w500/${e.poster_path}" alt="${e.title}" />\n        <h3 class="month-movie-title">${e.title}</h3>\n        <p class="info-key">\n          Release date <span class="info-value">${s}</span>\n        </p>\n        <p class="info-key">\n          Vote / Votes <span class="info-value">${e.vote_average}</span> / <span>${e.vote_count}</span>\n        </p>\n        <p class="info-key">Popularity <span class="info-value">${e.popularity.toFixed(1)}</span></p>\n        <p class="info-key">\n          Genre <span class="info-value">${t}</span>\n        </p>\n        <h4 class="about-title">About</h4>\n        <p class="about-description">\n          ${e.overview}\n        </p>\n        `;h.insertAdjacentHTML("afterbegin",o)}(e)})).catch((()=>{if(!movie)return function(){const e='<div class="error-message"><p>Oops...</p><p>We are very sorry!</p><p>There are no upcoming movies at the moment.</p></div> ';h.insertAdjacentHTML("afterbegin",e)}();!function(){const e='<div class="error-message"><p>Oops...</p><p>We are very sorry!</p><p>Something went wrong.</p></div>';h.insertAdjacentHTML("afterbegin",e)}()}));
//# sourceMappingURL=index.917e4c65.js.map
