import axios from 'axios';
import { KEY } from './API/api-key';

const sectionTitle = document.querySelector('.upcoming-section-title');

let movieData;
let addBtn;

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
    if (!movieData) {
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
  const posterUrl = getImageUrl(movie);

  const markup = `<div class="upcoming-desktop-container"><img 
  class="upcoming-section-img" 
  src="${posterUrl}" 
  alt="${movie.title}" 
/> 
<div class="upcoming-desktop-flex"> 
  <h3 class="upcoming-movie-title">${movie.title}</h3> 
  <div class="upcoming-flex-container"> 
    <div class="upcoming-tablet-flex"> 
      <div class="upcoming-data-flex"> 
        <p class="info-key">Release date</p> 
        <p class="info-value info-value-date">${dateFormat}</p> 
      </div> 
      <div class="upcoming-data-flex"> 
        <p class="info-key">Vote / Votes</p> 
        <p class="info-value"> 
          <span class="info-value-vote"> ${movie.vote_average}</span> / 
          <span class="info-value-vote">${movie.vote_count}</span> 
        </p> 
      </div> 
    </div> 
    <div class="upcoming-tablet-flex"> 
      <div class="upcoming-data-flex"> 
        <p class="info-key">Popularity</p> 
        <p class="info-value">${movie.popularity.toFixed(1)}</p> 
      </div> 
      <div class="upcoming-data-flex"> 
        <p class="info-key">Genre</p> 
        <p class="info-value">${genresList}</p> 
      </div> 
    </div> 
  </div> 
 
  <h4 class="about-title">About</h4> 
  <p class="about-description">${movie.overview}</p> 
  <button class="library-button upcoming-button">Add to my library</button> 
</div></div> 
        `;
  sectionTitle.insertAdjacentHTML('afterend', markup);

  addBtn = document.querySelector('.library-button');
  if (isMovieStored(movie.id)) {
    addBtn.textContent = 'Remove from my library';
  }
  addBtn.addEventListener('click', onBtnClick);
}

function getImageUrl(movie) {
  const baseImageUrl = 'https://image.tmdb.org/t/p/';
  const deviceWidth = window.innerWidth;

  if (deviceWidth >= 768) {
    return `${baseImageUrl}w1280/${movie.backdrop_path}`;
  } else {
    return `${baseImageUrl}w500/${movie.poster_path}`;
  }
}

function notFoundMarkup() {
  const markup =
    '<div class="error-message"><p>Oops...</p><p>We are very sorry!</p><p>There are no upcoming movies at the moment.</p></div> ';
  sectionTitle.insertAdjacentHTML('afterend', markup);
}

function errorMarkup() {
  const markup =
    '<div class="error-message"><p>Oops...</p><p>We are very sorry!</p><p>Something went wrong.</p></div>';
  sectionTitle.insertAdjacentHTML('afterend', markup);
}

export function onBtnClick() {
  const storedMovies = JSON.parse(localStorage.getItem('librariesKey')) || [];
  const movieId = movieData.id;

  if (isMovieStored(movieId)) {
    const index = storedMovies.findIndex(movie => movie.id === movieId);
    storedMovies.splice(index, 1);
    localStorage.setItem('librariesKey', JSON.stringify(storedMovies));

    addBtn.textContent = 'Add to my library';
  } else {
    storedMovies.push(movieData);
    localStorage.setItem('librariesKey', JSON.stringify(storedMovies));

    addBtn.textContent = 'Remove from my library';
  }
}

export function isMovieStored(movieId) {
  const storedMovies = JSON.parse(localStorage.getItem('librariesKey')) || [];
  return storedMovies.some(movie => movie.id === movieId);
}
