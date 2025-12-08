document.addEventListener('submit', async (e) => {
    if (e.target.id === 'search-form') {
    e.preventDefault()
    const searchFormData = new FormData(e.target)
    const searchFormDataObj = Object.fromEntries(searchFormData.entries())
    let resultsHtml = ``
    fetch(`http://www.omdbapi.com/?apikey=44d7feb2&s=${searchFormDataObj.title}`)
        .then(response => response.json())
        .then( async data => {
            const movieDetails = await Promise.all(data.Search.map(getMovieDetails))
            movieDetails.forEach(movie => {
                resultsHtml += `
                        <div class="movie-card flex" data-movie='${movie.imdbID}'>
                            <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title} Poster" />
                            <div class="movie-info flex">
                                <div class="title-rating flex">
                                    <h3>${movie.Title}</h3>
                                    <p>⭐️ ${movie.Rating.slice(0, -3)}</p>
                                </div>
                                <div class="runtime-genre-watchlist-btn flex"
                                    <p>${movie.Runtime}</p>
                                    <p>${movie.Genre}</p>
                                    <button class="watchlist-btn" data-movie='${movie.imdbID}'><i class="plus-icon fa-solid fa-circle-plus" style="color: #ffffff;"></i> Watchlist</button>
                                </div>
                                <div class="plot">
                                    <p>${movie.Plot}</p>
                                </div>
                            </div>
                        </div>
                        `
                    })
                document.getElementById('results-section').innerHTML = resultsHtml
            })
        e.target.reset()
    }
})

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
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
        if (!watchlist.includes(movieID)) {
            watchlist.unshift(movieID)
            localStorage.setItem('watchlist', JSON.stringify(watchlist))
            alert('Movie added to watchlist!')
        } else {
            alert('Movie is already in your watchlist.')
        }
    }
})

window.addEventListener('load', (e) => {
    if (e.target.id === 'watchlist-body') {
        let watchlistHtml = ``
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
        watchlist.forEach(movie => {
            watchlistHtml += movie
        })
        document.getElementById('watchlist-section').innerHTML = watchlistHtml
    }
})