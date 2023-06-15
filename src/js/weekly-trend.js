// import axios from 'axios';
// const BASE_URL = "https://api.themoviedb.org/3";
// const ENDPOINT = "/trending/movie/week";
// const API_KEY = "b90b64a7e05f9e36894001e36eb3b3c7";
// // const IMG_W400 = `/w400`;
// const IMG_PATH = "https://image.tmdb.org/t/p/w300";

// const list = document.querySelector('.js-list');
// let page = 1;
// let options = {
//     root: null,
//     rootMargin: "400px",
//     threshold: 0,
// };

// let observer = new IntersectionObserver(handlerPagination, options);

// function handlerPagination(entries, observer) {
//     // console.log(entries);
//     entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//             page += 1;
//             serviceMovie(page)
//                 .then(data => {
//                     list.insertAdjacentHTML('beforeend', createMarkup(data.results));
//                     if (data.total_pages <= data.page) {
//                         observer.unobserve(guard);
//                     }
//                 })
//         }
//     })
// }

//  function getTrending(page = 1) {

//     return fetch(`${BASE_URL}${ENDPOINT}?api_key=${API_KEY}&page=${page}`)
//         .then(resp => {
//             if (!resp.ok) {
//                 throw new Error(resp.statusText);
//             }

//             return resp.json()

//         })
// }
// getTrending()
//     .then(data => {
//         list.insertAdjacentHTML('beforeend', createMarkup(data.results))
//     })
//     .catch(err => console.log(err))

// function createMarkup(arr) {
//     return arr.slice(0, 3).map(({ original_title, poster_path, release_date,  id, genre_ids}) =>
//     `<li class='cards-list-item' id="${id}">
//        <img class='cards__list-img' src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${original_title}"  loading="lazy"
//        width="395px"
//        height="354px">
//        <div class='weekly-trends__overlay'></div>
//        <div class='cards__bloc-stars'>
//      <h2 class='cards__list-title'>${original_title}</h2>
//      <div class='cards__list-text'>${genre_ids} | ${release_date.slice(0, 4)}</div>
// </div></li>`).join('')
// }

const BASE_URL = 'https://api.themoviedb.org/3'; 
const ENDPOINT = '/trending/movie/week'; 
const API_KEY = 'b90b64a7e05f9e36894001e36eb3b3c7'; 
// const IMG_W400 = /w400; 
const IMG_PATH = 'https://image.tmdb.org/t/p/w300'; 
 
const list = document.querySelector('.js-list'); 
let page = 1; 
let options = { 
  root: null, 
  rootMargin: '400px', 
  threshold: 0, 
}; 
 
let observer = new IntersectionObserver(handlerPagination, options); 
 
function handlerPagination(entries, observer) { 
  // console.log(entries); 
  entries.forEach((entry) => { 
    if (entry.isIntersecting) { 
      page += 1; 
      serviceMovie(page).then((data) => { 
        list.insertAdjacentHTML('beforeend', createMarkup(data.results)); 
        if (data.total_pages <= data.page) { 
          observer.unobserve(guard); 
        } 
      }); 
    } 
  }); 
} 

async function getTrending(page = 1) { 
  return fetch(`${BASE_URL}${ENDPOINT}?api_key=${API_KEY}&page=${page}`).then( 
    (resp) => { 
      if (!resp.ok) { 
        throw new Error(resp.statusText); 
      } 
 
      return resp.json(); 
    } 
  ); 
} 
 
async function fetchGenres(movie) { 
  const response = await fetch( 
    'https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=' + 
      API_KEY 
  ); 
 
  const data = await response.json(); 
  console.log(movie);
  let genresArray = []; 
  const genres = data.genres; 
 
  for (const genre of genres) { 
    if (movie.genre_ids.includes(genre.id)) { 
      genresArray.push(genre.name); 
    } 
  } 
  return genresArray.slice(0, 2); 
} 
//  --------------------------------------------------------------------------------------------------


const createMarkup = async (arr) => {
  const genresPromises = arr.map(({ genre_ids }) => fetchGenres({ genre_ids }));
  const genresArrays = (await Promise.all(genresPromises));

  return arr
    .slice(0, 3)
    .map(
      ({ original_title, poster_path, vote_average, id, release_date }, index) => {
        const movieGenres = genresArrays[index];
        return `<li class='cards-list-item' data-id='${id}'>
          <img class='cards__list-img' src="${IMG_PATH}${poster_path}" alt="${original_title}" loading="lazy" 
          width="395px" 
           height="574px">
          <div class='weekly-trends__overlay'></div>
          <div class='cards__bloc-stars'>
            <h2 class='cards__list-title'>${original_title}</h2>
            <div class='cards__list-text'>${movieGenres.join(', ')} | ${release_date.slice(0, 4)}</div>
          </div>
          <div class="weekly__rating">
            <div class="weekly__stars">${getStars(vote_average)}</div>
          </div>
        </li>`;
      }
    )
    .join('');
};

function getStars(vote_average) {
 
// ----------------------------------------------------------
const fullStar = '★';
const emptyStar = '☆';
  const roundedRating = Math.round(vote_average);
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < roundedRating / 2) {
      stars += fullStar;
    } else {
      stars += emptyStar;
    }
  }

  return stars;
}

async function displayMovieRating(rating) {
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

getTrending() 
  .then(async (data) => { 
    list.insertAdjacentHTML('beforeend', await createMarkup(data.results)); 
  }) 
  .catch((err) => console.log(err));

// -------------------------------------

