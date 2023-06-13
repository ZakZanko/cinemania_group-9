import axios from 'axios';
import { KEY } from './API/api-key';

const container = document.querySelector('.container-upcoming-the-month');
const addBtn = document.querySelector('.library-button');
let movieData;

addBtn.addEventListener('click', onBtnClick);

async function fetchUpcomingMovies() {
  const response = await axios.get(
    'https://api.themoviedb.org/3/movie/upcoming?language=en-US',
    {
      params: {
        api_key: KEY,
      },
    }
  );
  const data = response.data;
  const randomNumber = Math.floor(Math.random() * data.results.length);
  const movie = data.results[randomNumber];

  return movie;
}

fetchUpcomingMovies()
  .then(movie => {
    movieData = movie;
    createMarkup(movie);
  })
  .catch(() => {
    if (!movie) {
      return notFoundMarkup();
    }
    errorMarkup();
  });

async function fetchGenres(movie) {
  const response = await axios.get(
    'https://api.themoviedb.org/3/genre/movie/list?language=en',
    {
      params: {
        api_key: KEY,
      },
    }
  );

  let genresArray = [];
  const genres = response.data.genres;

  for (const genre of genres) {
    if (movie.genre_ids.includes(genre.id)) {
      genresArray.push(genre.name);
    }
  }
  return genresArray;
}

async function createMarkup(movie) {
  const genresResponse = await fetchGenres(movie).then(response => {
    return response;
  });
  const genresList = genresResponse
    .map((genre, index) => {
      if (index === 0) {
        return genre.charAt(0).toUpperCase() + genre.slice(1);
      } else {
        return genre.toLowerCase();
      }
    })
    .join(', ');

  const dateParts = movie.release_date.split('-');
  const dateFormat = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

  const markup = `<img src="${posterUrl}" alt="${movie.title}" />
        <h3 class="month-movie-title">${movie.title}</h3>
        <p class="info-key">
          Release date <span class="info-value">${dateFormat}</span>
        </p>
        <p class="info-key">
          Vote / Votes <span class="info-value">${
            movie.vote_average
          }</span> / <span>${movie.vote_count}</span>
        </p>
        <p class="info-key">Popularity <span class="info-value">${movie.popularity.toFixed(
          1
        )}</span></p>
        <p class="info-key">
          Genre <span class="info-value">${genresList}</span>
        </p>
        <h4 class="about-title">About</h4>
        <p class="about-description">
          ${movie.overview}
        </p>
        `;
  container.insertAdjacentHTML('afterbegin', markup);
}

function notFoundMarkup() {
  const markup =
    '<div class="error-message"><p>Oops...</p><p>We are very sorry!</p><p>There are no upcoming movies at the moment.</p></div> ';
  container.insertAdjacentHTML('afterbegin', markup);
}

function errorMarkup() {
  const markup =
    '<div class="error-message"><p>Oops...</p><p>We are very sorry!</p><p>Something went wrong.</p></div>';
  container.insertAdjacentHTML('afterbegin', markup);
}

function onBtnClick() {
  const storedMovies = JSON.parse(localStorage.getItem('librariesKey')) || [];
  const movieId = movieData.id;

  if (isMovieStored(movieId)) {
    const index = storedMovies.findIndex(movie => movie.id === movieId);
    storedMovies.splice(index, 1);
    localStorage.setItem('librariesKey', JSON.stringify(storedMovies));

    addBtn.textContent = 'Add to my library';
  } else {
    storedMovies.push(movieData);
    localStorage.setItem('movie-info', JSON.stringify(storedMovies));

    addBtn.textContent = 'Remove from my library';
  }
}

function isMovieStored(movieId) {
  const storedMovies = JSON.parse(localStorage.getItem('librariesKey')) || [];
  return storedMovies.some(movie => movie.id === movieId);
}
