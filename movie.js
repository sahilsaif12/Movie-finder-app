// d6d1cafa76fa28915d91ce834fee17f4
// https://api.themoviedb.org/3/movie/550?api_key=d6d1cafa76fa28915d91ce834fee17f4
let search = document.getElementsByClassName('search')[0]
let submit = document.getElementsByClassName('submit')[0]
let genreSection = document.querySelector('section')
let genreSectionAfter = window.getComputedStyle(genreSection, ':after')

let main = document.querySelector('.main')
let prev = document.getElementsByClassName('prev')[0]
let next = document.getElementsByClassName('next')[0]
let logo = document.getElementsByClassName('logo')[0]
let genreView = false
let searchView = false
let homeView = true
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=d6d1cafa76fa28915d91ce834fee17f4&query=";
const GENRE_LIST = "https://api.themoviedb.org/3/genre/movie/list?api_key=d6d1cafa76fa28915d91ce834fee17f4&language=en-US"

const GENRE_WISE_SEARCH = " https://api.themoviedb.org/3/discover/movie?api_key=d6d1cafa76fa28915d91ce834fee17f4&with_genres=27"
let page = 1
let genreId
let genreWisePageLength
let searchWisePageLength
let genreBox
let genreBoxesClick

//! --- sets the landing home page ---
function homepage() {
    searchView = false
    homeView = true
    genreView = false
    fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=d6d1cafa76fa28915d91ce834fee17f4&page=${page}`)
        .then((res) => res.json())
        .then((data) => {
            movieBoxes(data)
            checkGenreActiveOrNot()
        })
}

homepage()

//! --- click on the icon and go to the landing home page ---
logo.addEventListener('click', () => {
    page = 1
    main.scrollTo(0, 0);
    homepage()
})

//! --- Getting all genre names on homepage ---
fetch(GENRE_LIST)
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        genreBoxes(data)
    })
    .catch(err => {
        console.log(err);
    });

//! --- After getting all genre names , displaying them and click on any genre will do an genre wise search ---
function genreBoxes(data) {
    let genre = data.genres
    for (let i = 0; i < genre.length; i++) {
        genreBox = document.createElement('div')
        genreBox.setAttribute('class', 'genreBox')
        genreSection.appendChild(genreBox)
        genreBox.innerHTML = genre[i].name
    }
    genreBoxesClick = document.querySelectorAll('.genreBox')

    for (let i = 0; i < genreBoxesClick.length; i++) {
        genreBoxesClick[i].addEventListener('click', () => {
            checkGenreActiveOrNot()
            genreBoxesClick[i].classList.add('active-genre')
            main.scrollTo(0, 0);
            genreWiseMovie(genre[i].id)
            page = 1
            setTimeout(() => {
                genreSection.classList.remove('genreListExpand')
            }, 10);
            if (window.outerWidth <= 700) {
                document.documentElement.style.setProperty('--sec_value', `"${genreBoxesClick[i].textContent}"`)
                document.documentElement.style.setProperty('--sec_bg', `linear-gradient(to bottom, #1a2980, #26d0ce)`)
            }
        })
    }
}

//! --- After clicking a genre , its fetch the genre api and give all matching result in multiple pages and in each page 20 movies ---
function genreWiseMovie(id) {
    searchView = false
    homeView = false
    genreView = true
    genreId = id
    fetch(` https://api.themoviedb.org/3/discover/movie?api_key=d6d1cafa76fa28915d91ce834fee17f4&with_genres=${id}&page=${page}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            genreWisePageLength = data.total_pages
            movieBoxes(data)
        })
        .catch(err => {
            console.log(err);
        });
}

//! --- Taking search value and pressing enter key as submit ---
search.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) {
        submit.click()
    }
})
submit.addEventListener('click', () => {
    main.scrollTo(0, 0);
    search.blur()
    search_A_movie(search.value)
    page = 1
})

//! --- prev and next btn for go to another pages in manual search result or genre search result ---
prev.addEventListener('click', () => {
    main.scrollTo(0, 0);
    page--
    if (genreView == true) {
        if (page == 0) {
            page = genreWisePageLength
        }
        genreWiseMovie(genreId)
    }
    else if (searchView == true) {
        if (page == 0) {
            page = searchWisePageLength
        }
        search_A_movie(search.value)
    }
    else if (homeView == true) {
        if (page < 1) {
            page = 1
        }
        else {
            homepage()
        }
    }
})

next.addEventListener('click', () => {
    main.scrollTo(0, 0);
    page++
    if (genreView == true) {
        if (page > genreWisePageLength) {
            page = 1
        }
        genreWiseMovie(genreId)
    }
    else if (searchView == true) {
        if (page > searchWisePageLength) {
            page = 1
        }
        search_A_movie(search.value)
    }
    else if (homeView == true) {
        if (page > 500) {
            page = 1
        }
        homepage()
    }
})

//! --- Taking user's search value and fetch the search api and gets matching results ---
function search_A_movie(value) {
    searchView = true
    homeView = false
    genreView = false

    fetch(` https://api.themoviedb.org/3/search/movie?&api_key=d6d1cafa76fa28915d91ce834fee17f4&query=${value}&page=${page}`)
        .then((response) => response.json())
        .then((data) => {
            searchWisePageLength = data.total_pages
            movieBoxes(data)
            checkGenreActiveOrNot()
        })
        .catch(err => {
            console.log(err);
        });
}



//! --- creation of movies boxes by getting result from genre search or manual search or homepage return ---
let movieBox
let movieBoxClick
let back
function movieBoxes(data) {
    main.innerHTML = ""
    let result = data.results
    for (let i = 0; i < result.length; i++) {
        let vote = result[i].vote_average
        movieBox = document.createElement('div')
        movieBox.setAttribute('class', 'movieBox')
        main.appendChild(movieBox)
        movieBox.innerHTML += `
        <div class="img-div">
        <img  load="lazy" src="${IMGPATH + result[i].poster_path}" alt="movie-poster">
        </div>
        
        <div class="title"><p>${result[i].title}</p>
        
        <a onclick="noPropagation(event)" href="https://www.google.com/search?btnG=1&pws=0&q=${result[i].title} movie hd or 720p 0r 480p download link" target="_blank">
        <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-down-circle" width="36" height="36" viewBox="0 0 24 24" stroke-width="1" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <circle cx="12" cy="12" r="9" />
  <line x1="8" y1="12" x2="12" y2="16" />
  <line x1="12" y1="8" x2="12" y2="16" />
  <line x1="16" y1="12" x2="12" y2="16" />
</svg>
      
      </span></a>
      <div class="overview">${result[i].overview}</div>
        </div>
        <div class="vote ${vote_borderColor(vote)}">${vote * 10} %</div>
    `
    }
    movieBoxClick = document.querySelectorAll('.movieBox')
    for (let i = 0; i < movieBoxClick.length; i++) {
        movieBoxClick[i].addEventListener('click', () => {
            main.classList.add('movieBoxActive')
            movieBoxClick[i].classList.add('movieBoxExpand')
            back = document.createElement('div')
            back.setAttribute('class', 'back')
            main.appendChild(back)
            back.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-narrow-left" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="#363636" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="5" y1="12" x2="9" y2="16" />
            <line x1="5" y1="12" x2="9" y2="8" />
          </svg>`
            back.addEventListener('click', () => {
                main.classList.remove('movieBoxActive')
                movieBoxClick[i].classList.remove('movieBoxExpand')
                main.removeChild(back)
            })
        })

    }
}

//! --- check the previous genre clicked and stops its functionality while we click on other genre or a manual search or return homepage ---
function checkGenreActiveOrNot() {
    for (let i = 0; i < genreBoxesClick.length; i++) {
        if (genreBoxesClick[i].classList.contains('active-genre')) {
            genreBoxesClick[i].classList.remove('active-genre')
        }
    }
}

//! --- it's for resolve an event propagation issue when we clicking on the download btn ---
function noPropagation(event) {
    event.stopPropagation()
}

//! --- according to movies vote , it will different classes for color changing ---
function vote_borderColor(vote) {
    if (vote >= 8) {
        return "vote-border-green"
    }
    else if (vote >= 5) {
        return "vote-border-yellow"
    }
    else {
        return "vote-border-red"
    }
}

//! --- it's for an optimization when device screen is less than 700 px ---
if (window.outerWidth <= 700) {
    let x
    genreSection.addEventListener('click', () => {
        genreSection.classList.add('genreListExpand')
        x = document.createElement('span')
        genreSection.appendChild(x)
        x.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <circle cx="12" cy="12" r="9" />
  <path d="M10 10l4 4m0 -4l-4 4" />
</svg>`
        x.addEventListener('click', (event) => {
            genreSection.removeChild(x)
            genreSection.classList.remove('genreListExpand')
            event.stopPropagation()
        }, true)
    })

    main.addEventListener('click', () => {
        genreSection.classList.remove('genreListExpand')
    })
    search.setAttribute("placeholder", "search...")
}


//# ----------------------------------- thank you ---------------------------------------