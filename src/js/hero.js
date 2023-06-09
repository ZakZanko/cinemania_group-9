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
const detailsModalOverview = document.querySelector('#detailsModal .modal-overview');
const detailsModalCloseBtn = document.querySelector('#detailsModal .modal-close-btn');

const trailerModal = document.getElementById('trailerModal');
const trailerModalTitle = document.querySelector('#trailerModal .modal-title');
const trailerModalTrailer = document.querySelector('#trailerModal .modal-trailer');
const trailerModalCloseBtn = document.querySelector('#trailerModal .modal-close-btn');

// отримання фільму дня
async function getTrendingMovie() {
  try {
    const response = await fetch(trendingMoviesUrl);
    const data = await response.json();
    if (data.results.length > 0) {
      const movie = data.results[Math.floor(Math.random() * data.results.length)];
      displayMovieInfo(movie);

      console.log(movie);

    } else {
      displayDefaultHeroContent();
    }
  } catch (error) {
    console.error(error);
    displayDefaultHeroContent();
  }
}

// інформація про фільм дня
function displayMovieInfo(movie) {
  hero.style.backgroundImage = `url(${backdropBaseUrl}${movie.backdrop_path})`;
  heroTitle.textContent = movie.title;
  heroRating.textContent = `Rating: ${movie.vote_average}`;
  heroOverview.textContent = movie.overview;
  
  detailsBtn.addEventListener('click', () => {
    openDetailsModal(movie);
  });

  trailerBtn.addEventListener('click', () => {
    openTrailerModal(movie.id);
  });
}

// контент за замовчуванням
function displayDefaultHeroContent() {
  hero.style.backgroundImage = "url('default-background.jpg')";
  heroTitle.textContent = 'Let’s Make Your Own Cinema';
  heroRating.textContent = '';
  heroOverview.textContent = 'Is a guide to creating a personalized movie theater experience. You"ll need a projector, screen, and speakers. Decorate your space, choose your films, and stock up on snacks for the full experience.';
  detailsBtn.textContent = 'Get started';
  detailsBtn.addEventListener('click', () => {
    window.location.href = 'catalog.html';
  });
  trailerBtn.style.display = 'none';
}

// Модальне вікно з інфою
function openDetailsModal(movie) {
  detailsModalTitle.textContent = movie.title;
  detailsModalOverview.textContent = movie.overview;
  detailsModal.style.display = 'flex';
}

// модалка з трейлером
async function openTrailerModal(movieId) {
  trailerModalTitle.textContent = 'Trailer';
  trailerModalTrailer.innerHTML = '';
 
  try {
    const response = await fetch(`${trailerBaseUrl}${movieId}/${trailerParams}`);
    const data = await response.json();
    if (data.results.length > 0) {
      const trailerKey = data.results[0].key;
      const trailerIframe = document.createElement('iframe');
      trailerIframe.width = '550';
      trailerIframe.height = '300';
      trailerIframe.src = `https://www.youtube.com/embed/${trailerKey}`;
      trailerIframe.allowFullscreen = true;
      trailerModalTrailer.appendChild(trailerIframe);
    } else {
      trailerModalTrailer.textContent = 'OOPS... We are very sorry! But we couldn’t find the trailer.';
    }
  } catch (error) {
    console.error(error);
    trailerModalTrailer.textContent = 'Failed to load trailer.';
  }

  trailerModal.style.display = 'flex';
}

// З інфо
detailsModalCloseBtn.addEventListener('click', () => {
  detailsModal.style.display = 'none';
});

// Закриття вікна трейлера
trailerModalCloseBtn.addEventListener('click', () => {
  trailerModal.style.display = 'none';
});

// ініціалізація сторінки
getTrendingMovie();

