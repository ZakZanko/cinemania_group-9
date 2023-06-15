import './js/header';
import './js/switch-color-bkg';
import './js/hero';
import './js/modal';
import './js/footer';

import axios from 'axios';
// import Notiflix from 'notiflix';
import { KEY } from './js/API/api-key';
import Pagination from 'tui-pagination';

const BASE_URL = 'https://api.themoviedb.org/3';
// const API_KEY = 'b90b64a7e05f9e36894001e36eb3b3c7';

// const onKeyWord = async (searchQuery, page) => {
//   return await axios.get(
//     `${BASE_URL}search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${page}`
//   );
// };

async function onKeyWord(searchQuery, page) {
  try {
    const url = `${BASE_URL}/search/movie?api_key=${KEY}&query=${searchQuery}&page=${page}`;
    const response = await axios.get(url);
    //console.log(response.data);
    // console.log(response.data.total_results);
    return response;
  } catch (error) {
    console.log(error);
    // Notify.failure('Oops, an error occurred');
  }
}

const getWeeklyMovies = async page => {
  return await axios.get(
    `${BASE_URL}/trending/movie/day?api_key=${KEY}&page=${page}`
  );
};

const getGanres = async () => {
  return await axios.get(`${BASE_URL}/genre/movie/list?api_key=${KEY}`);
};

const refs = {
  searchForm: document.querySelector('.ctg-search-form'),
  tuiPagination: document.querySelector('.tui-pagination'),
  moviesSection: document.querySelector('.ctg-movies'),
  galleryContainer: document.querySelector('.ctg-movies__list'),
  messageNoSearch: document.querySelector('.catalog-msg-nosearch'),
  messageNoWeeklyMovie: document.querySelector('.catalog-msg-noweeklymovie'),
  messageEmpty: document.querySelector('.catalog-msg-empty'),
  btnResetSearch: document.querySelector('.ctg-btn-close-search'),
  sectionPagination: document.querySelector('.section-pagination'),
};

let searchQuery = '';

let page = 1;

refs.searchForm.addEventListener('submit', onSearch);
refs.btnResetSearch.addEventListener('click', onResetSearch);

async function onSearch(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value;
  page = 1;
  refs.galleryContainer.innerHTML = '';
  refs.tuiPagination.classList.add('is-hidden');

  if (!searchQuery) {
    notFillFild();
    return;
  }

  await onKeyWord(searchQuery, page)
    .then(({ data }) => {
      const totalRes = data.total_results;

      if (!totalRes) {
        notFoundMarkup();
        return;
      }
      if (totalRes <= 20) {
        createMoviesMarkupKey(searchQuery, page);
        return;
      }

      createMoviesMarkupKey(searchQuery, page);
      createPaginationKey(searchQuery, totalRes);
      refs.sectionPagination.classList.remove('is-hidden');
      refs.tuiPagination.classList.remove('is-hidden');
    })
    .catch(error => console.log(error))
    .finally(() => {});
}

function notFoundMarkup() {
  const markup =
    '<div class="error-message"><p>Oops...</p><p>We are very sorry!</p><p>We don’t have any results matching your search.</p></div> ';
  refs.galleryContainer.insertAdjacentHTML('afterbegin', markup);
  refs.btnResetSearch.classList.remove('is-hidden');
  noSuccsessChangeClass();
}

function notFillFild() {
  const markup =
    '<div class="error-message"><p>Oops...</p><p>Please, fill out this field!</p></div> ';
  refs.galleryContainer.insertAdjacentHTML('afterbegin', markup);
  noSuccsessChangeClass();
}

function notFoundWeeklyMovies() {
  const markup =
    '<div class="error-message"><p>Oops...</p><p>We are very sorry!</p><p>There are no upcoming movies at the moment.</p></div> ';
  refs.galleryContainer.insertAdjacentHTML('afterbegin', markup);
  noSuccsessChangeClass();
}

function noSuccsessChangeClass() {
  refs.moviesSection.classList.remove('section-catalog');
  refs.moviesSection.classList.add('section-nosuccsess-msg');
  refs.sectionPagination.classList.add('is-hidden');
}

async function createMoviesMarkupKey(searchQuery, page) {
  const response = await onKeyWord(searchQuery, page);
  const results = response.data.results;

  const arrGanrId = response.data.results.map(item => item.genre_ids);
  //console.log('arrGanrId=', arrGanrId);

  const ganrResponse = await getGanres();
  const arrGanr = ganrResponse.data.genres;
  //console.log('arrGanr=', arrGanr);
  replaceIdtoGanr(arrGanr, arrGanrId);
  refs.btnResetSearch.classList.remove('is-hidden');
  markup(results);
}

//Підвантаження фільмів тиждня по замовчуванню
async function createMoviesMarkup(page) {
  if (document.querySelector('.ctg-section-title').textContent === 'Catalog') {
    refs.btnResetSearch.classList.add('is-hidden');
    const response = await getWeeklyMovies(page);
    if (!response) {
      notFoundWeeklyMovies();
      return;
    }
    const results = response.data.results;

    const arrGanrId = response.data.results.map(item => item.genre_ids);
    const ganrResponse = await getGanres();
    const arrGanr = ganrResponse.data.genres;

    replaceIdtoGanr(arrGanr, arrGanrId);
    markup(results);
    return;
  }
}
getWeeklyMovies(page)
  .then(({ data }) => {
    createMoviesMarkup(page);
    const totalRes = data.total_results;
    createPagination(totalRes);
  })
  .catch(error => console.log(error));

// Розмітка під галерею фільмів
const markup = results => {
  const markup = results
    .map(
      ({ poster_path, title, vote_average, id, release_date, genre_ids }) =>
        `<li class="movies-card" data-id="${id}">
              <img
              class="movies-card-photo"
              src="${checkImg(poster_path)}"
              alt="${title}"
              loading="lazy"
              width="395px"
              height="574px"
            />
            <div class="movies-card-overlay"></div>
            <h2 class="movies-card-title">${title}</h2>
            <p class="movies-card-genres">${genre_ids.slice(0, 2).join(', ')} | ${dataCheck(
          release_date
        )}</p>
            <p class="movies-card-rating">${getStars(vote_average)}</p>
          </li>`
    )
    .join('');

  //console.log(markup);

  return (refs.galleryContainer.innerHTML = markup);
};

//Перевірка наявності відео
const checkImg = url =>
  `${
    !url
      ? `https://dummyimage.com/400x600/cfcfcf/ffffff&text=OOPS...+NO+POSTER+AVAILABLE`
      : `https://image.tmdb.org/t/p/w500${url}`
  }`;

// Перевірка року випуску фільма
const dataCheck = value => `${!value ? 'Unknown' : `${value.slice(0, 4)}`}`;

// Функція очищення рядку пошуку
function onResetSearch(event) {
  event.preventDefault();
  refs.galleryContainer.innerHTML = '';
  //refs.tuiPagination.classList.add('is-hidden');
  refs.searchForm.reset();
  page = 1;
  createMoviesMarkup(page);
  refs.btnResetSearch.classList.add('is-hidden');
}

// Пагінація
function createPagination(total) {
  const container = document.getElementById('tui-pagination-container');
  const options = {
    totalItems: total,
    itemsPerPage: 20,
    visiblePages: 5,
    page: 1,
    centerAlign: false,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton: '<a href="#" class="tui-page-btn tui-{{type}}">' + '</a>',

      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };
  const pagination = new Pagination(container, options);

  pagination.on('afterMove', event => {
    const currentPage = event.page;
    createMoviesMarkup(currentPage);
  });
}
function createPaginationKey(searchQuery, total) {
  const container = document.getElementById('tui-pagination-container');

  const options = {
    totalItems: total,
    itemsPerPage: 20,
    visiblePages: 5,
    page: 1,
    centerAlign: false,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton: '<a href="#" class="tui-page-btn tui-{{type}}">' + '</a>',

      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };
  const pagination = new Pagination(container, options);
  pagination.on('afterMove', event => {
    //galleryContainer.innerHTML = '';
    const currentPage = pagination.getCurrentPage();
    createMoviesMarkupKey(searchQuery, currentPage);
  });
}
//Функція для отримання жанрів
function replaceIdtoGanr(arrGanr, arrGanrId) {
  arrGanrId.forEach(item => {
    for (let i = 0; i < item.length; i += 1) {
      for (let j = 0; j < arrGanr.length; j += 1) {
        item[i] === arrGanr[j].id ? (item[i] = arrGanr[j].name) : item[i];
      }
    }
  });
}




//Функція для отримання зірочок №1
// function displayMovieRat(rating) {
//   const roundedRating = Math.round(rating);
//   let stars = '';
//   for (let i = 0; i < 5; i++) {
//     if (i < roundedRating / 2) {
//       stars += '★';
//     } else {
//       stars += '☆';
//     }
//   }

//   return stars;
// }

//Функція для отримання зірочок №2 не працює
function displayMovieRating(rating) {
  const roundedRating = Math.round(rating);
  let stars = '';
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < roundedRating / 2; j++) {
      createFullStar();
    }
    // for (let j = 0; j < 5 - roundedRating / 2; j++) {
    //   createEmptyStar();
    // }
  }
  //return (refs.galleryContainer.innerHTML = markup);
  //return stars;
}
// function createFullStar() {
//   const makeup =
//     '<svg class="ctg-svg-magnifying-glass" width="15px" height="15px"><use href="/src/img/sprite.svg#icon-magnifying-glass"></use></svg>';
//   console.log('FullStar', makeup);
//   return makeup;
// }
// function createEmptyStar() {
//   const makeup =
//     '<svg class="ctg-svg-magnifying-glass" width="15px" height="15px"><use href="/src/img/sprite.svg#icon-cross""></use></svg>';
//   console.log('Emptystar', makeup);
//   return makeup;
// }
// createEmptyStar(1);
// createFullStar(1);

//Функція для отримання зірочок №3
function getStars(vote_average) {
  const emptyStar = `<svg class="star" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.875 7.3125H10.8281L9 1.6875L7.17188 7.3125H1.125L6.04688 10.6875L4.14844 16.3125L9 12.7969L13.8516 16.3125L11.9531 10.6875L16.875 7.3125Z" stroke="url(#paint0_linear_405_766)" stroke-linejoin="round"/>
    <defs>
    <linearGradient id="paint0_linear_405_766" x1="3.375" y1="2.625" x2="13.5" y2="16.5" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F84119"/>
    <stop offset="1" stop-color="#F89F19" stop-opacity="0.68"/>
    </linearGradient>
    </defs>
    </svg>`;

  const fullStar = `<svg class="star" width="18" height="18" viewBox="0 0 18 18" fill="rgba(248, 65, 25, 1)" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.875 7.3125H10.8281L9 1.6875L7.17188 7.3125H1.125L6.04688 10.6875L4.14844 16.3125L9 12.7969L13.8516 16.3125L11.9531 10.6875L16.875 7.3125Z" stroke="url(#paint0_linear_405_766)" stroke-linejoin="round"/>
    <defs>
    <linearGradient id="paint0_linear_405_766" x1="3.375" y1="2.625" x2="13.5" y2="16.5" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F84119"/>
    <stop offset="1" stop-color="#F89F19" stop-opacity="0.68"/>
    </linearGradient>
    </defs>
    </svg>`;

  const halfStar = `<svg class="star" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.875 7.3125H10.8281L9 1.6875L7.17188 7.3125H1.125L6.04688 10.6875L4.14844 16.3125L9 12.7969L13.8516 16.3125L11.9531 10.6875L16.875 7.3125Z" stroke="url(#paint0_linear_148_6991)" stroke-linejoin="round"/>
    <path d="M9 1.6875V12.7969L4.14844 16.3125L6.04688 10.6875L1.125 7.3125H7.17188L9 1.6875Z" fill="url(#paint1_linear_148_6991)"/>
    <defs>
    <linearGradient id="paint0_linear_148_6991" x1="3.04877" y1="2.73251" x2="13.478" y2="16.7124" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F84119"/>
    <stop offset="1" stop-color="#F89F19" stop-opacity="0.68"/>
    </linearGradient>
    <linearGradient id="paint1_linear_148_6991" x1="2.08688" y1="2.73251" x2="12.1506" y2="9.47748" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F84119"/>
    <stop offset="1" stop-color="#F89F19" stop-opacity="0.68"/>
    </linearGradient>
    </defs>
    </svg>`;

  let ratingStars = '';

  const rating = Math.round(vote_average);

  switch (rating) {
    case 0:
      ratingStars = `${emptyStar.repeat(5)}`;
      break;
    case 1:
      ratingStars = `${halfStar}${emptyStar.repeat(4)}`;
      break;
    case 2:
      ratingStars = `${fullStar}${emptyStar.repeat(4)}`;
      break;
    case 3:
      ratingStars = `${fullStar}${halfStar}${emptyStar.repeat(3)}`;
      break;
    case 4:
      ratingStars = `${fullStar.repeat(2)}${emptyStar.repeat(3)}`;
      break;
    case 5:
      ratingStars = `${fullStar.repeat(2)}${halfStar}${emptyStar.repeat(2)}`;
      break;
    case 6:
      ratingStars = `${fullStar.repeat(3)}${emptyStar.repeat(2)}`;
      break;
    case 7:
      ratingStars = `${fullStar.repeat(3)}${halfStar}${emptyStar}`;
      break;
    case 8:
      ratingStars = `${fullStar.repeat(4)}${emptyStar}`;
      break;
    case 9:
      ratingStars = `${fullStar.repeat(4)}${halfStar}`;
      break;
    case 10:
      ratingStars = `${fullStar.repeat(5)}`;
      break;
    default:
      throw new Error('Invalid rating');
  }
  return ratingStars;
}

function hasScrollBehavior() {
  return 'scrollBehavior' in document.documentElement.style;
}

function smoothScroll() {
  let currentY = window.scrollY;
  const scrollInterval = setInterval(() => {
    window.scrollTo(0, currentY);

    if (currentY > 500) {
      currentY -= 70;
    } else if (currentY > 100) {
      currentY -= 50;
    } else {
      currentY -= 10;
    }

    if (currentY <= 0) {
      clearInterval(scrollInterval);
    }
  }, 1000 / 60); // Змінено на 60fps
}

function scrollToTop() {
  if (hasScrollBehavior()) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    smoothScroll();
  }
}

function toggleScrollUpButton() {
  const y = window.scrollY;
  const e = document.getElementById('scroll-to-top');
  if (y >= 200) {
    e.style.transform = 'translateY(-30%)';
    e.style.opacity = '1';
  } else {
    e.style.opacity = '0';
    e.style.transform = 'translateY(30%)';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.removeEventListener('DOMContentLoaded', toggleScrollUpButton, false);

  window.addEventListener('scroll', toggleScrollUpButton);

  const e = document.getElementById('scroll-to-top');
  e.addEventListener('click', scrollToTop, false);
});
