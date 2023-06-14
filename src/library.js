import './js/modal';
import './js/header';
import './js/switch-color-bkg';
import './js/footer';

import { createListMarkup } from './render';
import { getMovieById2 } from './js/API/api';

const librariesKey = 'b90b64a7e05f9e36894001e36eb3b3c7';
let page = 1;
let perPage = 9;


const KEY_LOCAL_STOREG_LIBRARY = "librariesKey";
// let localLibrary ='';

const refs = {
  listFilms: document.getElementById('list-films'),
  libraryList: document.querySelector('.library-list'),
  loadMoreButton: document.getElementById('loadMore'),
};

window.addEventListener('DOMContentLoaded', createLibraryLocal)


function createLibraryLocal() {
  const localLibrary = load(KEY_LOCAL_STOREG_LIBRARY);
  
  
  if (localLibrary) {
    createMarkup(localLibrary);
  }
  else {
     const opsText = '<li class="oppsText"><p>OOPS...</p> <p>We are very sorry!</p> <p> You don’t have any movies at your library.</p><li>'
  refs.listFilms.innerHTML = opsText;
  }


}




function createMarkup(localLibrary) {
  localLibrary
  console.log(localLibrary);
  const markup = localLibrary.reduce(
    (markup, film) => markup + createFilmItem(film),
    ''
  );
  
  updateMarkup(markup);
  
}

function createFilmItem({
  poster_path,
  title,
  vote_average,
  id,
  release_date,
  genre_ids,
}) {
  return `
  <li class="movies-card" data-id="${id}">
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
    <p class="movies-card-genres">${genre_ids.join(', ')} | ${dataCheck(release_date)}</p>
    <p class="movies-card-rating">${getStars(vote_average)}</p>
  </li>`;
}


const checkImg = url =>
  `${
    !url
      ? `https://dummyimage.com/400x600/cfcfcf/ffffff&text=OOPS...+NO+POSTER+AVAILABLE`
      : `https://image.tmdb.org/t/p/w500${url}`
  }`;

const dataCheck = value => `${!value ? 'Unknown' : `${value.slice(0, 4)}`}`;

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

function updateMarkup(markup) {
  console.log(markup)
  refs.listFilms.insertAdjacentHTML('beforeend', markup);
    
}



// const save = (key, value) => {
//   try {
//     const serializedState = JSON.stringify(value);
//     localStorage.setItem(key, serializedState);
//   } catch (error) {
//     console.error('Set state error: ', error.message);
//   }
// };

const load = key => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
};


















// if (refs.libraryList) renderLibraryData();
// if (refs.loadMoreButton) {
//   refs.loadMoreButton.addEventListener('click', () => {
//     page += 1;
//     renderLibraryData();
//   });
// }





















// // localStorage
// function addMovieToLibrary(movieId) {
//   getMovieById2(movieId).then(movie => {
//     movie.genre_names = movie.genres
//       .map(genre => {
//         return genre.name;
//       })
//       .slice(0, 2)
//       .join(',');
//     if (movie.release_date) {
//       movie.release_date = movie.release_date.slice(0, 4);
//     }
//     let libraries = JSON.parse(localStorage.getItem(librariesKey)) || {};
//     libraries[movie.id] = movie;
//     localStorage.setItem(librariesKey, JSON.stringify(libraries));
//   });
// }

// function removeMovieFromLibrary(movieId) {
//   let libraries = JSON.parse(localStorage.getItem(librariesKey)) || {};
//   // delete libraries[movieId];
//   localStorage.setItem(librariesKey, JSON.stringify(libraries));
//   if (refs.libraryList) renderLibraryData();
// }

// function getMovieFromLibrary(movieId) {
//   const libraries = JSON.parse(localStorage.getItem(librariesKey)) || {};
//   return libraries[movieId];
// }

// function getMoviesFromLibrary() {
//   const libraries = JSON.parse(localStorage.getItem(librariesKey)) || {};
//   return Object.values(libraries);
// }

// function renderLibraryData() {
//   let movieMarkup = renderMovies();
//   if (!movieMarkup) {
//     movieMarkup = `
//     <div class=" container">
//       <p class="library-empty__mistake">OOPS... <br> We are very sorry! <br> You don't have any movies at your library.</p>
// <a class="btn-library__link" onclick="window.location.href='catalog.html'">Search movie</a>
//     </div>
//       `;
//   } else {
//     movieMarkup = `<ul class="cards__list films">${movieMarkup}</ul>`;
//   }
//   refs.libraryList.innerHTML = movieMarkup;
// }

// function renderMovies() {
//   const allMovies = getMoviesFromLibrary();

//   if (!Object.keys(allMovies)) {
//     return null;
//   }

//   let movies = allMovies.slice(0, page * perPage);

//   const markup = createListMarkup(movies);

//   refs.loadMoreButton.style = 'display: none;';
//   if (allMovies.length > page * perPage) {
//     refs.loadMoreButton.style = '';
//   }
//   return markup;
// }

// // spiner?
// window.onload = function () {
//   document.body.classList.add('loaded_hiding');
//   window.setTimeout(function () {
//     document.body.classList.add('loaded');
//     document.body.classList.remove('loaded_hiding');
//   }, 500);
// };
