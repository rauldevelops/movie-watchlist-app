let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
let movieCardsHtml = ``

document.addEventListener('submit', async (e) => {
    if (e.target.id === 'search-form') {
    e.preventDefault()
    const searchFormData = new FormData(e.target)
    const searchFormDataObj = Object.fromEntries(searchFormData.entries())
    fetch(`http://www.omdbapi.com/?apikey=44d7feb2&s=${searchFormDataObj.title}`)
        .then(response => response.json())
        .then( async data => {
            const movieDetails = await Promise.all(data.Search.map(getMovieDetails))
            movieDetails.forEach(movie => { renderMovieCard(movie) })
                document.getElementById('results-section').innerHTML = movieCardsHtml
            })
        e.target.reset()
    }
})
    
async function renderMovieCard(movie) {
    const isWatchlistPage = window.location.pathname.endsWith('watchlist.html');
    const buttonText = isWatchlistPage ? 'Remove' : 'Watchlist';
    const buttonClass = isWatchlistPage ? 'remove-btn' : 'watchlist-btn';
    const iconClass = isWatchlistPage ? 'fa-circle-minus' : 'fa-circle-plus';

    movieCardsHtml += `
        <div class="movie-card flex" data-movie='${movie.imdbID}'>
            <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title} Poster" />
            <div class="movie-info flex">
                <div class="title-rating flex">
                    <h3>${movie.Title}</h3>
                    <p>⭐️ ${movie.Rating.slice(0, -3)}</p>
                </div>
                <div class="runtime-genre-watchlist-btn flex">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <button class="${buttonClass}" id="${buttonClass}" data-movie='${movie.imdbID}'>
                        <i class="icon fa-solid ${iconClass}" style="color: #ffffff;"></i> ${buttonText}
                    </button>
                </div>
                <div class="plot">
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </div>
    `;
}

async function getMovieDetails(movie) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=44d7feb2&i=${movie.imdbID}`)
    const data = await response.json()
    return {
        imdbID: data.imdbID,
        Poster: data.Poster,
        Title: data.Title,
        Rating: data.Ratings[0].Value,
        Runtime: data.Runtime,
        Genre: data.Genre,
        Plot: data.Plot
    }
}

document.addEventListener('click', (e) => {
    if (e.target.dataset.movie) {
        const movieID = e.target.dataset.movie
        if (e.target.id === 'remove-btn') {
            watchlist = watchlist.filter(id => id !== movieID)
            localStorage.setItem('watchlist', JSON.stringify(watchlist))
            e.target.closest('.movie-card').remove()
            return
        } else {
            if (!watchlist.includes(movieID)) {
                watchlist.unshift(movieID)
                localStorage.setItem('watchlist', JSON.stringify(watchlist))
                alert('Movie added to watchlist!')
            } else {
                alert('Movie is already in your watchlist.')
            }
        }
    }
})

document.addEventListener('DOMContentLoaded', (e) => {
    if (window.location.pathname.endsWith('watchlist.html')) {
        if (watchlist.length === 0) {
            document.getElementById('watchlist-section').innerHTML = `
                <div class="search-placeholder-container flex">
                    <p class="search-placeholder-text">Your watchlist is looking a little empty...</p>
                    <a class="search-link" href="index.html"><i class="plus-icon fa-solid fa-circle-plus" style="color: #ffffff;"></i> Let's add some movies!</a>
                </div>
                `
        } else {
            watchlist.forEach( async (movieID) => {
                const movie = await getMovieDetails({ imdbID: movieID })
                renderMovieCard(movie)
                document.getElementById('watchlist-section').innerHTML = movieCardsHtml
            })
        }
    }
})