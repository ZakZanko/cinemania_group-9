import defaultImg from '../images/img/img.png';
import axios from 'axios';
import Defoltimg from '../images/hero-desktop-1x.jpg';
import DefoltImgTablet from '../images/hero-tablet-1x.jpg';
import DefoltImgMobil from '../images/hero-mobile-1x.jpg';

const API_KEY = 'b0c24f4300d90d0bb33ad49b06fe89dd';
const trendingMoviesUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
const backdropBaseUrl = 'https://image.tmdb.org/t/p/original/';
const trailerBaseUrl = 'https://api.themoviedb.org/3/movie/';
const trailerParams = `videos?api_key=${API_KEY}&language=en-US`;

const hero = document.getElementById('hero');
const heroTitle = document.querySelector('.hero-title');
const heroRating = document.querySelector('.hero-rating');
const heroOverview = document.querySelector('.hero-overview');
const detailsBtn = document.querySelector('.hero-details-btn');
const trailerBtn = document.querySelector('.hero-trailer-btn');

const detailsModal = document.getElementById('detailsModal');
const detailsModalTitle = document.querySelector('#detailsModal .modal-title');
const detailsModalOverview = document.querySelector(
  '#detailsModal .modal-overview'
);
const detailsModalCloseBtn = document.querySelector(
  '#detailsModal .modal-close-btn'
);

const trailerModal = document.getElementById('trailerModal');
const trailerModalTitle = document.querySelector('#trailerModal .modal-title');
const trailerModalTrailer = document.querySelector(
  '#trailerModal .modal-trailer'
);
const trailerModalCloseBtn = document.querySelector(
  '#trailerModal .modal-close-btn'
);
const trailerModalContent = document.querySelector('.trailer-modal-content');

//  Пошук фільму через ФЕЧ
// async function getTrendingMovie() {
//   try {
//     const response = await fetch(trendingMoviesUrl);
//     const data = await response.json();
//     if (data.results.length > 0) {
//       const movie = data.results[Math.floor(Math.random() * data.results.length)];
//       displayMovieInfo(movie);

//       console.log(movie);

//     } else {
//       displayDefaultHeroContent();
//     }
//   } catch (error) {
//     console.error(error);
//     displayDefaultHeroContent();
//   }
// }

// Пошук фільму дня
async function getTrendingMovie() {
  try {
    const response = await axios.get(trendingMoviesUrl);
    const data = response.data;
    if (data.results.length > 0) {
      const movie =
        data.results[Math.floor(Math.random() * data.results.length)];
      displayMovieInfo(movie);

      // console.log(movie);
    } else {
      displayDefaultHeroContent();
    }
  } catch (error) {
    console.error(error);
    displayDefaultHeroContent();
  }
}

// Відображення в герої інформації про фільм дня

function displayMovieInfo(movie) {
  hero.style.backgroundImage = `url(${backdropBaseUrl}${movie.backdrop_path})`;
  heroTitle.textContent = movie.title;
  const overviewText = movie.overview;

  // Обмеження кількості слів (15) та додавання '...' в кінці
  const maxWords = 15;
  let limitText = overviewText.split(' ').slice(0, maxWords).join(' ');
  if (overviewText.split(' ').length > maxWords) {
    limitText += '...';
  }
  heroOverview.textContent = limitText;

  detailsBtn.addEventListener('click', () => {
    openDetailsModal(movie);
  });

  trailerBtn.addEventListener('click', () => {
    openTrailerModal(movie.id);
  });

  // Отримання рейтингу фільму
  const movieRating = movie.vote_average;

  // Відображення рейтингу фільму
  displayMovieRating(movieRating);
}
// відображення рейтингу в зірочках
function displayMovieRating(rating) {
  const roundedRating = Math.round(rating);
  const starsElement = document.querySelector('.stars');
  const ratingValueElement = document.querySelector('.rating-value');

  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < roundedRating / 2) {
      stars += '★';
    } else {
      stars += '☆';
    }
  }

  starsElement.textContent = stars;
  ratingValueElement.textContent = `Rating: ${rating.toFixed(1)}`;
}

// Інформація в герої за замовчуванням
function displayDefaultHeroContent() {
  const windowWidth = window.innerWidth;
  let backgroundImageURL = Defoltimg;

  if (windowWidth <= 480) {
    backgroundImageURL = DefoltImgMobil;
  } else if (windowWidth <= 1158) {
    backgroundImageURL = DefoltImgTablet;
  }

  hero.style.backgroundImage = `url(${backgroundImageURL})`;
  heroTitle.textContent = 'Let’s Make Your Own Cinema';
  heroRating.textContent = '';
  heroOverview.textContent =
    'Is a guide to creating a personalized movie theater experience. You"ll need a projector, screen, and speakers. Decorate your space, choose your films, and stock up on snacks for the full experience.';
  trailerBtn.textContent = 'Get started';
  trailerBtn.addEventListener('click', () => {
    window.location.href = 'catalog.html';
  });
  detailsBtn.style.display = 'none';
  trailerBtn;
}

// Модальне вікно з інформацією
function openDetailsModal(movie) {
  detailsModalTitle.textContent = movie.title;
  detailsModalOverview.textContent = movie.overview;
  detailsModal.style.display = 'flex';
}

// Відкриття модального трейлера
async function openTrailerModal(movieId) {
  trailerModalTrailer.innerHTML = '';

  try {
    const response = await fetch(
      `${trailerBaseUrl}${movieId}/${trailerParams}`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const trailerKey = data.results[0].key;
      const trailerIframe = document.createElement('iframe');
      trailerIframe.width = '100%';
      trailerIframe.height = '100%';
      trailerIframe.src = `https://www.youtube.com/embed/${trailerKey}`;
      trailerIframe.allowFullscreen = true;
      trailerModalTrailer.appendChild(trailerIframe);

      trailerModalCloseBtn.style.background = 'none';
      trailerModalCloseBtn.style.outline = '1px solid orange';
      trailerModalCloseBtn.style.color = 'orange';
    } else {
      trailerModalTrailer.textContent = 'Failed to load trailer.';
      trailerModalContent.classList.remove('trailer-modal-content');
    }
  } catch (error) {
    console.error(error);

    trailerModalContent.classList.add('modal-trailer-defolt');
    const popUpHTML = `

      <div class="modal-trailer-defolt">
      <div class="modal-trailer-defolt-text">
      <p class="modal-def">OOPS...<br>We are very sorry!<br>But we couldn't the trailer.</p>
      </div>`;
    trailerModalTrailer.innerHTML = popUpHTML;
  }

  trailerModal.style.display = 'flex';
}

// Закриття модального вікна
detailsModalCloseBtn.addEventListener('click', () => {
  detailsModal.style.display = 'none';
});

// Закриття вікна трейлера
trailerModalCloseBtn.addEventListener('click', () => {
  trailerModal.style.display = 'none';
});

getTrendingMovie();
