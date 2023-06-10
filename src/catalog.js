//import { page, perPage, data } from '../index.js';
import axios from 'axios';

import Notiflix from 'notiflix';
import { key } from '../src/API/api-key';
//import { onKeyWord } from '../../api-services/movies-api-service';
//import { createMoviesMarkupKey } from './home-movies';
//import { createPagiKey } from '../pagination';

//export { searchQuery };

const BASE_URL = 'https://api.themoviedb.org/3';
//const key = 'b90b64a7e05f9e36894001e36eb3b3c7';

// const onKeyWord = async (searchQuery, page) => {
//   return await axios.get(
//     `${BASE_URL}search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${page}`
//   );
// };

async function onKeyWord(searchQuery, page) {
  try {
    const url = `${BASE_URL}/search/movie?api_key=${key}&query=${searchQuery}&page=${page}`;
    const response = await axios.get(url);
    // console.log(response.data);
    // console.log(response.data.total_results);
    return response;
  } catch (error) {
    console.log(error);
    Notify.failure('Oops, an error occurred');
  }
}

// const onKeyWord = async (searchQuery, page) => {
//   return await axios.get(
//     `${BASE_URL}search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${page}`
//   );
// };

const refs = {
  searchForm: document.querySelector('.search-form'),
  //tuiPagination: document.querySelector('.tui-pagination'),
  moviesSection: document.querySelector('.movies'),
  galleryContainer: document.querySelector('.movies__list'),
};

let searchQuery = '';
let page = 1;

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value;
  page = 1;
  refs.galleryContainer.innerHTML = '';
  //refs.tuiPagination.classList.add('is-hidden');

  if (!searchQuery) {
    notifyInfoSearch();
    return;
  }

  await onKeyWord(searchQuery, page)
    .then(({ data }) => {
      const totalRes = data.total_results;
      console.log(data.total_results);
      console.log(totalRes);
      if (!totalRes) {
        notifyFailure();
        return;
      }
      if (totalRes <= 20) {
        //refs.moviesSection.classList.add('movies--padding');
        createMoviesMarkupKey(searchQuery, page);
        return;
      }

      //refs.moviesSection.classList.remove('movies--padding');
      createMoviesMarkupKey(searchQuery, page);
      //createPagiKey(searchQuery, totalRes);
      //refs.tuiPagination.classList.remove('is-hidden');
    })
    .catch(error => console.log(error))
    .finally(() => {
      refs.searchForm.reset();
    });
}

const notifyInfoSearch = () => {
  return Notiflix.Report.info(
    'Empty query 🧐',
    'Please, fill out this field!',
    {
      timeout: 4000,
    }
  );
};

const notifyFailure = () => {
  return Notiflix.Report.failure(
    'Ooops 😕',
    'Search result not successful. Enter the correct movie name',
    {
      timeout: 4000,
    }
  );
};

async function createMoviesMarkupKey(searchQuery, page) {
  const response = await onKeyWord(searchQuery, page);
  const results = response.data.results;
  console.log(results);
  //const arrGenerId = response.data.results.map(item => item.genre_ids);

  //const genreResponse = await getGanres();
  //const arrGener = genreResponse.data.genres;

  //replaceIdtoGener(arrGener, arrGenerId);

  markup(results);
}
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
        `<li class="movies-card" id="${id}">
              <img
              class="movies-card-photo"
              src="https://image.tmdb.org/t/p/w500${poster_path}"
              alt="${title}"
              loading="lazy"
              width="395px"
              height="354px"
            />
            <h2 class="movies-card-title">${original_title}</h2>
            <p class="movies-card-genres">${genre_ids.join(
              ', '
            )} | ${dotaReleaseCheck(release_date)}</p>
            <p class="movies-card-rating">${vote_average}</p>
          </li>`
    )
    .join('');
  console.log(markup);
  return (refs.galleryContainer.innerHTML = markup);
  //return galleryContainer.insertAdjacentHTML('beforeend', markup);
};

// Проверка даты релиза
const dotaReleaseCheck = value =>
  `${!value ? 'Unknown' : `${value.slice(0, 4)}`}`;
