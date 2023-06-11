 import './js/header';
 import './js/hero';
import './js/footer';
import { createListMarkup } from './render';
import { getMovieById2 } from './API/api';

const librariesKey = 'b90b64a7e05f9e36894001e36eb3b3c7';
let page = 1;
let perPage = 9;

const refs = {
  libraryList: document.querySelector('.library-list'),
  loadMoreButton: document.getElementById('loadMore'),
};

if (refs.libraryList) renderLibraryData();
if (refs.loadMoreButton) {
  refs.loadMoreButton.addEventListener('click', () => {
    page += 1;
    renderLibraryData();
  });
}

// localStorage
export function addMovieToLibrary(movieId) {
  getMovieById2(movieId).then(movie => {
    movie.genre_names = movie.genres
      .map(genre => {
        return genre.name;
      })
      .slice(0, 2)
      .join(',');
    if (movie.release_date) {
      movie.release_date = movie.release_date.slice(0, 4);
    }
    let libraries = JSON.parse(localStorage.getItem(librariesKey)) || {};
    libraries[movie.id] = movie;
    localStorage.setItem(librariesKey, JSON.stringify(libraries));
  });
}

export function removeMovieFromLibrary(movieId) {
  let libraries = JSON.parse(localStorage.getItem(librariesKey)) || {};
  delete libraries[movieId];
  localStorage.setItem(librariesKey, JSON.stringify(libraries));
  if (refs.libraryList) renderLibraryData();
}

export function getMovieFromLibrary(movieId) {
  const libraries = JSON.parse(localStorage.getItem(librariesKey)) || {};
  return libraries[movieId];
}

function getMoviesFromLibrary() {
  const libraries = JSON.parse(localStorage.getItem(librariesKey)) || {};
  return Object.values(libraries);
}

export function renderLibraryData() {
  let movieMarkup = renderMovies();
  if (!movieMarkup) {
    movieMarkup = `
    <div class=" container">
      <p class="library-empty__mistake">OOPS... <br> We are very sorry! <br> You don't have any movies at your library.</p>
<a class="btn-library__link" onclick="window.location.href='catalog.html'">Search movie</a>
    </div>
      `;
  } else {
    movieMarkup = `<ul class="cards__list films">${movieMarkup}</ul>`;
  }
  refs.libraryList.innerHTML = movieMarkup;
}

function renderMovies() {
  const allMovies = getMoviesFromLibrary();

  if (!Object.keys(allMovies)) {
    return null;
  }

  let movies = allMovies.slice(0, page * perPage);

  const markup = createListMarkup(movies);

  refs.loadMoreButton.style = 'display: none;';
  if (allMovies.length > page * perPage) {
    refs.loadMoreButton.style = '';
  }
  return markup;
}

// spiner?
window.onload = function () {
  document.body.classList.add('loaded_hiding');
  window.setTimeout(function () {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
  }, 500);
};

