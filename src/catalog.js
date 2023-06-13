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

// const notifyInfoSearch = () => {
//   refs.messageEmpty.classList.remove('is-hidden');
//   refs.moviesSection.classList.remove('section-catalog');
//   refs.moviesSection.classList.add('section-nosuccsess-msg');
//   refs.sectionPagination.classList.add('is-hidden');
//  };

// const notifyNoSearch = () => {
//   refs.btnResetSearch.classList.remove('is-hidden');
//   refs.messageNoSearch.classList.remove('is-hidden');
//   refs.moviesSection.classList.remove('section-catalog');
//   refs.moviesSection.classList.add('section-nosuccsess-msg');
//   refs.sectionPagination.classList.add('is-hidden');
//   };

// const notifyNoWeeklyMovies = () => {
//   refs.messageNoWeeklyMovie.classList.remove('is-hidden');
//   refs.moviesSection.classList.remove('section-catalog');
//   refs.moviesSection.classList.add('section-nosuccsess-msg');
//   refs.sectionPagination.classList.add('is-hidden');
// };

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
      ({
        poster_path,
        title,
        original_title,
        vote_average,
        id,
        release_date,
        genre_ids,
      }) =>
        `<li class="movies-card" data-id="${id}">
              <img
              class="movies-card-photo"
              src="${checkImg(poster_path)}"
              alt="${title}"
              loading="lazy"
              width="395px"
              height="354px"
            />
            <h2 class="movies-card-title">${original_title}</h2>
            <p class="movies-card-genres">${genre_ids.join(', ')} | ${dataCheck(
          release_date
        )}</p>
            <p class="movies-card-rating">${displayMovieRating(
              vote_average
            )}</p>
        
          </li>`
    )
    .join('');
  console.log(markup);

  return (refs.galleryContainer.innerHTML = markup);
};

//Перевірка наявності відео
const checkImg = url =>
  `${
    !url
      ? `https://dummyimage.com/400x600/cfcfcf/ffffff&text=NO+POSTER+AVAILABLE`
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

function replaceIdtoGanr(arrGanr, arrGanrId) {
  arrGanrId.forEach(item => {
    for (let i = 0; i < item.length; i += 1) {
      for (let j = 0; j < arrGanr.length; j += 1) {
        item[i] === arrGanr[j].id ? (item[i] = arrGanr[j].name) : item[i];
      }
    }
  });
}

function displayMovieRating(rating) {
  const roundedRating = Math.round(rating);
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < roundedRating / 2) {
      stars += '★';
    } else {
      stars += '☆';
    }
  }

  return stars;
}
