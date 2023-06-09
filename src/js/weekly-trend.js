const BASE_URL = "https://api.themoviedb.org/3";
const ENDPOINT = "/trending/movie/week";
const API_KEY = "b90b64a7e05f9e36894001e36eb3b3c7";
// const IMG_W400 = `/w400`;
const IMG_PATH = "https://image.tmdb.org/t/p/w300";


const list = document.querySelector('.js-list');
// const guard = document.querySelector('.js-guard')
let page = 1;
let options = {
    root: null,
    rootMargin: "400px",
    threshold: 0,
};

let observer = new IntersectionObserver(handlerPagination, options);

function handlerPagination(entries, observer) {
    // console.log(entries);
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            page += 1;
            serviceMovie(page)
                .then(data => {
                    list.insertAdjacentHTML('beforeend', createMarkup(data.results));
                    if (data.total_pages <= data.page) {
                        observer.unobserve(guard);
                    }
                })
        }
    })
}

async function serviceMovie(page = 1) {
    return fetch(`${BASE_URL}${ENDPOINT}?api_key=${API_KEY}&page=${page}&minimum=3`)
        .then(resp => {
            if (!resp.ok) {
                throw new Error(resp.statusText);
            }

            return resp.json()
            
        })
}

serviceMovie()
    .then(data => {
        list.insertAdjacentHTML('beforeend', createMarkup(data.results))
        if (data.total_pages > data.page) {
            observer.observe(guard);
        }
        
    })
    .catch(err => console.log(err))

// function createMarkup(arr) {
//     return arr.map(({ original_title, poster_path, release_date, genre_names}) => `<li class='cards__list-item'>
//     <img class='cards__list-img' src="https://image.tmdb.org/t/p/w400${poster_path}" alt="${original_title}">
//     <h2 class='cards__list-title'>${original_title}</h2>
//     <div class='cards__list-text'>${genre_names} | ${release_date}<span class='cards__list-span'></span></div>
// </li>`).join('')
// }
function createMarkup(arr) {
    return arr.slice(0, 3).map(({ original_title, poster_path, release_date, genre_names}) => `<li class='cards__list-item'>
       <img class='cards__list-img' src="https://image.tmdb.org/t/p/w400${poster_path}" alt="${original_title}">
     <h2 class='cards__list-title'>${original_title}</h2>
    <div class='cards__list-text'>${genre_names} | ${release_date}<span class='cards__list-span'></span></div>
     </li>`).join('')
}